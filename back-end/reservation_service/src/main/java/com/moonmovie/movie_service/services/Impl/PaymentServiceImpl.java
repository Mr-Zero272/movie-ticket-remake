package com.moonmovie.movie_service.services.Impl;

import com.moonmovie.movie_service.constants.ReservationErrorConstants;
import com.moonmovie.movie_service.dao.OrderDao;
import com.moonmovie.movie_service.dao.TicketDao;
import com.moonmovie.movie_service.dto.TicketDto;
import com.moonmovie.movie_service.exceptions.GlobalException;
import com.moonmovie.movie_service.exceptions.ReservationException;
import com.moonmovie.movie_service.feign.SeatServiceInterface;
import com.moonmovie.movie_service.helpers.HelpersService;
import com.moonmovie.movie_service.kafka.KafkaProducerService;
import com.moonmovie.movie_service.models.Order;
import com.moonmovie.movie_service.models.Payment;
import com.moonmovie.movie_service.models.Ticket;
import com.moonmovie.movie_service.requests.PaymentMethodRequest;
import com.moonmovie.movie_service.requests.PaymentRequest;
import com.moonmovie.movie_service.responses.PaymentMethodResponse;
import com.moonmovie.movie_service.responses.ResponseTemplate;
import com.moonmovie.movie_service.services.PaymentService;
import com.moonmovie.movie_service.services.TicketService;
import com.moonmovie.movie_service.zalocrypto.HMACUtil;
import lombok.extern.slf4j.Slf4j;
import org.apache.http.NameValuePair;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.message.BasicNameValuePair;
import org.bson.types.ObjectId;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.util.*;

@Service
public class PaymentServiceImpl implements PaymentService {

    private static final Logger log = LoggerFactory.getLogger(PaymentServiceImpl.class);
    @Autowired
    private OrderDao orderDao;

    @Autowired
    private HelpersService helpersService;

    @Autowired
    private KafkaProducerService kafkaProducerService;

    @Autowired
    private TicketDao ticketDao;

    @Autowired
    private TicketService ticketService;

    @Autowired
    private SeatServiceInterface seatServiceInterface;

    @Override
    public Payment addPayment(PaymentRequest request) {
        Order order = orderDao.findById(request.getOrderId()).orElseThrow(() -> new ReservationException(ReservationErrorConstants.ERROR_ORDER_NOT_EXIST));
        Payment payment = Payment.builder()
                .invoiceId(request.getInvoiceId())
                .total(request.getTotal())
                .paymentStatus(request.getPaymentStatus())
                .method(request.getMethod())
                .description(request.getDescription())
                .timestamp(LocalDateTime.now())
                .build();
        List<Payment> oldPayments = order.getPayments();
        oldPayments.add(payment);
        order.setPayments(oldPayments);

        List<Ticket> tickets = ticketDao.findAllByOrderId(order.getId());
        List<String> seatIds = tickets.stream().map(Ticket::getSeatId).toList();
        if (request.getPaymentStatus().equalsIgnoreCase("paid")) {
            order.setOrderStatus("complete");
            tickets.forEach(t -> {
                t.setStatus("paid");
            });
            ticketDao.saveAll(tickets);
            // Send mail
            try {
                ticketService.sendTicketsToCusByMail(tickets, request.getCustomerEmail());
            } catch (Exception e){
                log.info("Cannot send email, skip...");
            }

            kafkaProducerService.sendSeatDetailInfo(seatIds, order.getCustomerId());
        } else {
            kafkaProducerService.sendRefreshSeatsInfo(seatIds);
        }
        orderDao.save(order);
        return payment;
    }

    private void checkBeforeCreatePayment(String orderId, String customerId) throws ReservationException {
        List<Ticket> tickets = ticketDao.findAllByOrderId(orderId);
        List<String> seatIds = tickets.stream().map(Ticket::getSeatId).toList();
        ResponseTemplate res = seatServiceInterface.checkListSeatAvailableToCheckout(seatIds, customerId).getBody();
        if (res.getStatus() != 200) {
            throw new GlobalException(res.getStatus(), "Some seats is not available to checkout!");
        }
    }

    @Override
    public PaymentMethodResponse getPaymentForVnPay(PaymentMethodRequest request) throws UnsupportedEncodingException
            , ReservationException {
        this.checkBeforeCreatePayment(request.getOrderId(), request.getUserId());
        String vnp_Version = "2.1.0";
        String vnp_Command = "pay";
        String vnp_OrderInfo = request.getDescription();
        String orderType = "other";
        String vnp_TxnRef = request.getTransactionId();
        String vnp_IpAddr = "127.0.0.1";
        String vnp_TmnCode = "OYDVKJE0";

        int amount = request.getAmount() * 100;
        Map vnp_Params = new HashMap<>();
        vnp_Params.put("vnp_Version", vnp_Version);
        vnp_Params.put("vnp_Command", vnp_Command);
        vnp_Params.put("vnp_TmnCode", vnp_TmnCode);
        vnp_Params.put("vnp_Amount", String.valueOf(amount));
        vnp_Params.put("vnp_CurrCode", "VND");
        vnp_Params.put("vnp_TxnRef", vnp_TxnRef);
        vnp_Params.put("vnp_OrderInfo", vnp_OrderInfo);
        vnp_Params.put("vnp_OrderType", orderType);
        vnp_Params.put("vnp_Locale", "vn");
        vnp_Params.put("vnp_ReturnUrl", request.getReturnUrl());
        vnp_Params.put("vnp_IpAddr", vnp_IpAddr);
        Calendar cld = Calendar.getInstance(TimeZone.getTimeZone("Etc/GMT+7"));

        SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
        String vnp_CreateDate = formatter.format(cld.getTime());

        vnp_Params.put("vnp_CreateDate", vnp_CreateDate);
        cld.add(Calendar.MINUTE, 15);
        String vnp_ExpireDate = formatter.format(cld.getTime());
        //Add Params of 2.1.0 Version
        vnp_Params.put("vnp_ExpireDate", vnp_ExpireDate);

        //Build data to hash and querystring
        List fieldNames = new ArrayList(vnp_Params.keySet());
        Collections.sort(fieldNames);
        StringBuilder hashData = new StringBuilder();
        StringBuilder query = new StringBuilder();
        Iterator itr = fieldNames.iterator();
        while (itr.hasNext()) {
            String fieldName = (String) itr.next();
            String fieldValue = (String) vnp_Params.get(fieldName);
            if ((fieldValue != null) && (fieldValue.length() > 0)) {
                //Build hash data
                hashData.append(fieldName);
                hashData.append('=');
                hashData.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));
                //Build query
                query.append(URLEncoder.encode(fieldName, StandardCharsets.US_ASCII.toString()));
                query.append('=');
                query.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));
                if (itr.hasNext()) {
                    query.append('&');
                    hashData.append('&');
                }
            }
        }
        String queryUrl = query.toString();
        String vnp_SecureHash = helpersService.hmacSHA512("ZPMZQAODTVUEUCEEZGHCMWRRBLHLFBLL", hashData.toString());
        queryUrl += "&vnp_SecureHash=" + vnp_SecureHash;
        String paymentUrl = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html" + "?" + queryUrl;
//        JsonObject job = new JsonObject();
//        job.addProperty("code", "00");
//        job.addProperty("message", "success");
//        job.addProperty("data", paymentUrl);
//        Gson gson = new Gson();
//        resp.getWriter().write(gson.toJson(job));
        PaymentMethodResponse res = new PaymentMethodResponse();
        res.setUrlPayment(paymentUrl);
        res.setMethod("vnpay");
        return res;
    }

    private static Map<String, String> config = new HashMap<String, String>() {{
        put("app_id", "2553");
        put("key1", "PcY4iZIKFCIdgZvA6ueMcMHHUbRLYjPL");
        put("key2", "kLtgPl8HHhfvMuDHPwKfgfsY4Ydm9eIz");
        put("endpoint", "https://sb-openapi.zalopay.vn/v2/create");
    }};

    @Override
    public PaymentMethodResponse getPaymentForZaloPay(PaymentMethodRequest request) throws IOException, ReservationException {
        this.checkBeforeCreatePayment(request.getOrderId(), request.getUserId());
        final Map embed_data = new HashMap() {{
        }};
        embed_data.put("redirecturl", request.getReturnUrl());

        Map<String, Object> order = new HashMap<String, Object>() {{
            put("app_id", config.get("app_id"));
            put("app_trans_id", request.getTransactionId()); // translation missing: en.docs.shared.sample_code.comments.app_trans_id
            put("app_time", System.currentTimeMillis()); // miliseconds
            put("app_user", "user123");
            put("amount", request.getAmount());
            put("description", request.getDescription());
            put("bank_code", "");
            put("item", "[{}]");
            put("embed_data", new JSONObject(embed_data).toString());
        }};

        // app_id +”|”+ app_trans_id +”|”+ appuser +”|”+ amount +"|" + app_time +”|”+ embed_data +"|" +item
        String data = order.get("app_id") + "|" + order.get("app_trans_id") + "|" + order.get("app_user") + "|" + order.get("amount")
                + "|" + order.get("app_time") + "|" + order.get("embed_data") + "|" + order.get("item");
        order.put("mac", HMACUtil.HMacHexStringEncode(HMACUtil.HMACSHA256, config.get("key1"), data));

        CloseableHttpClient client = HttpClients.createDefault();
        HttpPost post = new HttpPost(config.get("endpoint"));

        List<NameValuePair> params = new ArrayList<>();
        for (Map.Entry<String, Object> e : order.entrySet()) {
            params.add(new BasicNameValuePair(e.getKey(), e.getValue().toString()));
        }

        String paramsUrl = "";
        for (int i = 0; i < params.size(); i++) {
            paramsUrl += params.get(i).getName() + "=" + params.get(i).getValue() + "&";
        }

        // Content-Type: application/x-www-form-urlencoded
        post.setEntity(new UrlEncodedFormEntity(params));

        CloseableHttpResponse res = client.execute(post);
        BufferedReader rd = new BufferedReader(new InputStreamReader(res.getEntity().getContent()));
        StringBuilder resultJsonStr = new StringBuilder();
        String line;

        while ((line = rd.readLine()) != null) {
            resultJsonStr.append(line);
        }

        JSONObject result = new JSONObject(resultJsonStr.toString());
        Map<String, Object> objResult = new HashMap<>();
        for (String key : result.keySet()) {
            objResult.put(key, result.get(key));
        }
        System.out.println(objResult);
        PaymentMethodResponse response = new PaymentMethodResponse();
        response.setMethod("zalopay");
        response.setUrlPayment((String) objResult.get("order_url"));
        return response;
    }
}
