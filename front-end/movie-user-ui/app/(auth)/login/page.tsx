import { Bot } from 'lucide-react';
import Image from 'next/image';
import React from 'react';

type Props = {};

const LoginPage = (props: Props) => {
    return (
        <section>
            <div className="mx-auto flex flex-col rounded-lg bg-white">
                <div className="draggable my-auto flex h-full w-full justify-center md:gap-5 lg:justify-normal xl:gap-14">
                    <div className="flex w-full items-center justify-center lg:p-12">
                        <div className="flex items-center xl:p-10">
                            <form className="flex h-full w-full flex-col rounded-3xl bg-white pb-6 text-center">
                                <h3 className="text-dark-grey-900 mb-3 text-4xl font-extrabold">Sign In</h3>
                                <p className="text-grey-700 mb-4">Enter your email and password</p>
                                <a className="text-grey-900 bg-grey-300 hover:bg-grey-400 focus:ring-grey-300 mb-6 flex w-full items-center justify-center rounded-2xl py-4 text-sm font-medium transition duration-300 focus:ring-4">
                                    <img
                                        className="mr-2 h-5"
                                        src="https://raw.githubusercontent.com/Loopple/loopple-public-assets/main/motion-tailwind/img/logos/logo-google.png"
                                        alt=""
                                    />
                                    Sign in with Google
                                </a>
                                <div className="mb-3 flex items-center">
                                    <hr className="border-grey-500 h-0 grow border-b border-solid" />
                                    <p className="text-grey-600 mx-4">or</p>
                                    <hr className="border-grey-500 h-0 grow border-b border-solid" />
                                </div>
                                <label htmlFor="email" className="text-grey-900 mb-2 text-start text-sm">
                                    Email*
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    placeholder="mail@loopple.com"
                                    className="focus:bg-grey-400 placeholder:text-grey-700 bg-grey-200 text-dark-grey-900 mb-7 mr-2 flex w-full items-center rounded-2xl px-5 py-4 text-sm font-medium outline-none"
                                />
                                <label htmlFor="password" className="text-grey-900 mb-2 text-start text-sm">
                                    Password*
                                </label>
                                <input
                                    id="password"
                                    type="password"
                                    placeholder="Enter a password"
                                    className="focus:bg-grey-400 placeholder:text-grey-700 bg-grey-200 text-dark-grey-900 mb-5 mr-2 flex w-full items-center rounded-2xl px-5 py-4 text-sm font-medium outline-none"
                                />
                                <div className="mb-8 flex flex-row justify-between">
                                    <label className="relative mr-3 inline-flex cursor-pointer select-none items-center">
                                        <input
                                            type="checkbox"
                                            defaultChecked
                                            defaultValue=""
                                            className="peer sr-only"
                                        />
                                        <div className="border-grey-500 peer-checked:bg-purple-blue-500 peer h-5 w-5 rounded-sm border-2 bg-white peer-checked:border-0">
                                            <Bot />
                                        </div>
                                        <span className="text-grey-900 ml-3 text-sm font-normal">
                                            Keep me logged in
                                        </span>
                                    </label>
                                    <a
                                        href="javascript:void(0)"
                                        className="text-purple-blue-500 mr-4 text-sm font-medium"
                                    >
                                        Forget password?
                                    </a>
                                </div>
                                <button className="hover:bg-purple-blue-600 focus:ring-purple-blue-100 bg-purple-blue-500 mb-5 w-full rounded-2xl px-6 py-5 text-sm font-bold leading-none text-white transition duration-300 focus:ring-4 md:w-96">
                                    Sign In
                                </button>
                                <p className="text-grey-900 text-sm leading-relaxed">
                                    Not registered yet?{' '}
                                    <a href="javascript:void(0)" className="text-grey-700 font-bold">
                                        Create an Account
                                    </a>
                                </p>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default LoginPage;
