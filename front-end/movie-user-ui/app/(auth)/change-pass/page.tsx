'use client';
import React, { Fragment, useState } from 'react';
import SendOtpCodeForm from './SendOtpCodeForm';
import ValidCodeForm from './ValidCodeForm';
import ChangePasswordForm from './ChangePasswordForm';
import { cn } from '@/lib/utils';

type Props = {};

const ChangePassPage = (props: Props) => {
    const [step, setStep] = useState<'sendOtpCode' | 'validCode' | 'changePassword'>('sendOtpCode');
    const [currentEmail, setCurrentEmail] = useState<string>('');
    const [shouldRender, setShouldRender] = useState(false);

    const handleSendOtpCodeChangePassword = (email: string) => {
        setCurrentEmail(email);
        setStep('validCode');
    };

    const handleValidCode = () => {
        setStep('changePassword');
        setTimeout(() => {
            setShouldRender(false);
        }, 500);

        setTimeout(() => {
            setShouldRender(true);
        }, 800);
    };

    const handleChangeForm = () => {
        switch (step) {
            case 'sendOtpCode':
                setStep('validCode');
                break;
            case 'validCode':
                setStep('changePassword');
                break;
            default:
                setStep('sendOtpCode');
        }
    };
    return (
        <div className="flex flex-col">
            {step === 'sendOtpCode' && (
                <SendOtpCodeForm onSendOtpCodeChangePassword={handleSendOtpCodeChangePassword} />
            )}

            {step === 'validCode' && <ValidCodeForm email={currentEmail} onValidCode={handleValidCode} />}
            {step === 'changePassword' && <ChangePasswordForm email={currentEmail} />}
        </div>
    );
};

export default ChangePassPage;
