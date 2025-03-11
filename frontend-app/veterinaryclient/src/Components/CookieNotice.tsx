"use client";
import {memo, useEffect, useRef, useState} from "react";
import {useCookies} from "react-cookie";

const CookieNotice = memo(function CookieNotice(){
    const cookieNotif = useRef(null);
    const dialog = useRef(null);
    const [cookies, setCookie, removeCookie] = useCookies(['utm_cookie']);
    const now = new Date();
    now.setDate(now.getDate() + 1);
    const SetCookieAcceptance = () => {
        setCookie('utm_cookie',1,{
            path:'/',
            sameSite:'lax',
            expires:now
        });
        setHasAcceptedCookie(true);
    }
    const [hasAcceptedCookie, setHasAcceptedCookie] = useState(cookies.utm_cookie ? true : false);
    return (
        <>
            {!hasAcceptedCookie ? (
                <>
                    <div ref={cookieNotif} suppressHydrationWarning
                         className="flex flex-col space-y-1 modal-overlay flex-wrap w-[100%] justify-center items-center">
                        <div ref={dialog} className="flex flex-col space-y-1 modal flex-wrap w-[100%] md:w-[50%]">
                            <h2>Cookie usage</h2>
                            <p>
                                We process personal data about users of our site, through the use of cookies and other
                                technologies, to deliver our services, personalize advertising, and to analyze site
                                activity. We may share certain information about our users with our advertising and
                                analytics partners. For additional details, refer to our Privacy Policy.
                            </p>
                            <p>
                                By clicking "I AGREE" below, you agree to our Privacy Policy and our personal data
                                processing and cookie practices as described therein. You also consent to the transfer
                                of your data to our servers in the United States, where data protection laws may be
                                different from those in your country.
                            </p>
                            <div className="flex flex-col space-y-1 w-[100%] p-5 items-center">
                                <button type="button" className="button button-default" onClick={SetCookieAcceptance}>
                                    I agree
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            ) : null}
        </>
    )
});
export default CookieNotice;