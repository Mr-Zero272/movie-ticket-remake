import TicketBase from '@/components/cards/TicketBase';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn, formatCurrencyVND } from '@/lib/utils';
import { currentUser } from '@/services/authServices';
import { getOrderById, getTicketsByOrderId } from '@/services/reservationServices';
import { format } from 'date-fns';
import { HandCoins, SearchX } from 'lucide-react';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import BackBtn from './back-btn';
import PayAgainButton from './pay-again-button';

type Props = {
    params: Promise<{ orderId: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    // read route params
    const orderId = (await params).orderId;
    return {
        title: 'Order ' + orderId + ' - Moon Movie',
        description: 'Choose your seats real time here',
    };
}

const OrderDetailPage = async ({ params }: Props) => {
    const userInfo = await currentUser();

    if (userInfo === undefined) {
        redirect('/sign-in');
    }

    if (!userInfo?.onboarded) redirect('/onboarding');

    const orderId = (await params).orderId;
    const orderDetail = await getOrderById(orderId);
    if (orderDetail.customerId !== userInfo.id) {
        redirect('/not-found');
    }
    const tickets = await getTicketsByOrderId(orderId);

    return (
        <section className="flex flex-col p-5 md:max-h-[33rem] md:flex-row">
            <article className="md:w-1/3">
                <div className="p-5">
                    <h1 className="text-3xl font-bold">Order detail</h1>
                </div>
                <div className="flex justify-center">
                    <Separator className="w-11/12 place-content-center" />
                </div>
                <div className="space-y-5 p-5">
                    <div>
                        <h4 className="mb-1 font-medium">Customer Name</h4>
                        <p className="text-gray-400">{userInfo.username}</p>
                    </div>
                    <div>
                        <h4 className="mb-1 font-medium">Customer Email</h4>
                        <p className="text-gray-400">{userInfo.email}</p>
                    </div>
                    <div>
                        <h4 className="mb-1 font-medium">Order Amount</h4>
                        <p className="text-gray-400">{formatCurrencyVND(orderDetail.amount)}</p>
                    </div>
                </div>
                <div className="flex justify-center py-2">
                    <Separator className="w-11/12 place-content-center" />
                </div>
                <div className="space-y-5 p-5">
                    <div>
                        <h4 className="mb-1 font-medium">Provider Name</h4>
                        <p className="text-gray-400">Moon Movie</p>
                    </div>
                    <div>
                        <h4 className="mb-1 font-medium">Seller Support</h4>
                        <p className="text-gray-400">+84395570930</p>
                        <p className="text-gray-400">moommoviesupport@mm.com</p>
                    </div>
                </div>
            </article>
            <article className="flex-1 overflow-auto">
                <div className="p-5">
                    <h4 className="mb-1 text-gray-400">Order No.</h4>
                    <p className="text-2xl font-medium">#{orderDetail.id}</p>
                </div>
                <div className="flex justify-center py-2">
                    <Separator className="w-11/12 place-content-center" />
                </div>
                <div className="flex justify-between p-5">
                    <div>
                        <h4 className="mb-1 text-gray-400">Your order is</h4>
                        <p className="text-3xl font-bold capitalize">{orderDetail.orderStatus}</p>
                        <p className="font-medium">as on {format(orderDetail.timestamp, 'dd MMM yyyy, EEEE')}</p>
                    </div>
                    <div>
                        {orderDetail.orderStatus !== 'complete' && (
                            <PayAgainButton
                                total={orderDetail.amount}
                                orderId={orderDetail.id}
                                customerId={userInfo.id}
                                currentEmail={userInfo.email}
                            />
                        )}
                        <div className="flex items-center">
                            <HandCoins className="size-4" />
                            <Button variant="link" className="text-gray-500">
                                Refund
                            </Button>
                        </div>
                        <BackBtn />
                    </div>
                </div>
                <div className="flex justify-center py-2">
                    <Separator className="w-11/12 place-content-center" />
                </div>
                <div className="p-5">
                    <h4 className="mb-2">Payment History</h4>
                    <ul className="space-y-2">
                        {orderDetail.payments.map((payment) => (
                            <li key={payment.invoiceId} className="flex max-w-80 items-center justify-between">
                                <div className="flex-1">
                                    <p className="font-medium">{format(payment.timestamp, 'dd MMM yyyy')}</p>
                                    <p className="text-xs text-gray-400">At {format(payment.timestamp, 'HH:mm a')}</p>
                                </div>
                                <div className="w-10">
                                    <div className="pointer-events-none h-4 w-1 rounded-full bg-gray-200"></div>
                                </div>
                                <div className="flex-1">
                                    <p className="font-medium">
                                        Status{' '}
                                        <span
                                            className={cn('', {
                                                'text-red-500': payment.paymentStatus === 'failed',
                                                'text-green-500': payment.paymentStatus === 'paid',
                                            })}
                                        >
                                            {payment.paymentStatus}
                                        </span>
                                    </p>
                                    <p className="text-xs text-gray-400">Method {payment.method}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="p-5">
                    <h4 className="mb-2">List Tickets</h4>
                    <ul className="space-y-2">
                        {tickets.length !== 0 ? (
                            tickets.map((ticket) => (
                                <li key={ticket.id}>
                                    <TicketBase {...ticket} />
                                </li>
                            ))
                        ) : (
                            <div className="flex flex-col items-center gap-y-3 text-center text-gray-500">
                                <SearchX strokeWidth={1} className="size-20 text-primary" />
                                <h2 className="text-3xl font-bold">Whoops!</h2>
                                <p>It seems like your tickets is missing. You can call our team to get supports</p>
                            </div>
                        )}
                    </ul>
                </div>
            </article>
        </section>
    );
};

export default OrderDetailPage;
