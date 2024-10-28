'use client';
import PaymentForm from '@/components/forms/PaymentForm';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { createRandomTransId } from '@/lib/utils';
import { RefreshCw } from 'lucide-react';
import { useState } from 'react';

type Props = {
    total: number;
    orderId: string;
    customerId: string;
    currentEmail: string;
};

const PayAgainButton = ({ total, orderId, customerId, currentEmail }: Props) => {
    const [transId, setTransId] = useState(() => createRandomTransId());
    return (
        <Dialog>
            <DialogTrigger asChild>
                <div className="flex items-center" onClick={() => setTransId(() => createRandomTransId())}>
                    <RefreshCw className="size-4" />
                    <Button variant="link" className="text-gray-500">
                        Pay again
                    </Button>
                </div>
            </DialogTrigger>
            <DialogContent className="w-96 py-10">
                <DialogTitle>Choose your method</DialogTitle>
                <PaymentForm
                    invoiceId={transId}
                    total={total}
                    startTime=""
                    showingId={1}
                    currentEmail={currentEmail}
                    customerId={customerId}
                    isPayAgain={orderId}
                />
            </DialogContent>
        </Dialog>
    );
};

export default PayAgainButton;
