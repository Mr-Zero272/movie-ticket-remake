'use client';
import { useState } from 'react';
import ChangePasswordForm from './ChangePasswordForm';
import SendOtpCodeForm from './SendOtpCodeForm';
import ValidCodeForm from './ValidCodeForm';

const ChangePassPage = () => {
    const [step, setStep] = useState<'sendOtpCode' | 'validCode' | 'changePassword'>('sendOtpCode');
    const [currentEmail, setCurrentEmail] = useState<string>('');

    const handleSendOtpCodeChangePassword = (email: string) => {
        setCurrentEmail(email);
        setStep('validCode');
    };

    const handleValidCode = () => {
        setStep('changePassword');
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
