'use client';
import { cn } from '@/lib/utils';
import { Step } from '@/types/stepper';
import React, { useEffect, useState } from 'react';

type Props = {
    value: string;
    data: Step[];
    onChooseStep: (stepInfo: Step) => void;
};

const Stepper = ({ value, data, onChooseStep }: Props) => {
    const [step, setStep] = useState(value);
    const [done, setDone] = useState<string[]>([]);

    useEffect(() => {
        setStep(value);
        setDone((prev) => [...prev, value]);
    }, [value]);

    const handleChooseStep = (stepInfo: Step) => {
        setStep(stepInfo.value);
        onChooseStep(stepInfo);
    };

    return (
        <div className="flex flex-wrap">
            {data.map((st) => {
                const active = step === st.value;
                return (
                    <div
                        key={st.value}
                        className={cn(
                            'flex cursor-pointer items-center gap-x-3 border-b-2 border-gray-200 p-2 text-sm',
                            {
                                'border-primary': active,
                            },
                        )}
                        onClick={() => handleChooseStep(st)}
                    >
                        <p className={cn('rounded-lg bg-gray-500 px-3 py-1.5 text-gray-400', { 'text-white': active })}>
                            {st.step}
                        </p>
                        <div>
                            <p
                                className={cn('hidden text-gray-400 sm:block', {
                                    'font-semibold text-gray-900 dark:text-white': active,
                                })}
                            >
                                {st.label}
                            </p>
                            <p
                                className={cn('text-gray-400 sm:hidden', {
                                    'font-semibold text-gray-900 dark:text-white': active,
                                })}
                            >
                                {'STEP' + st.step}
                            </p>
                            <p className="hidden text-xs text-gray-500 sm:block">
                                {active
                                    ? `STEP ${st.step} OF ${data.length}`
                                    : done.includes(st.value)
                                      ? 'DONE'
                                      : 'NOT DONE YET'}
                            </p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default Stepper;
