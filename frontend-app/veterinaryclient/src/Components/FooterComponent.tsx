import Link from "next/link";

export default function FooterComponent()
{
    const ScrollToTop = () => {
        window.scrollTo({top:0,behavior:"smooth"});
    }
    return (
        <>
            <footer className="flex footer-copyright flex-col flex-wrap space-y-1 items-start w-[100%]">
                <div className="flex w-[100%] flex-row justify-center mb-3 relative">
                    <p>Developed by <a href="#">Mihaela</a> & <a href="#">Riste</a>.</p>
                </div>
                <div className="flex flex-row footer-links flex-wrap items-start p-10 w-[100%] space-x-2">
                    <div className="scrollerTop" onClick={ScrollToTop}></div>
                    <div className="flex flex-col flex-wrap items-start">
                        <Link href="/" title="Homepage">Home</Link>
                        <Link href="/login" title="Login">Login</Link>
                        <Link href="/register" title="Register">Register</Link>
                    </div>
                    <section className="flex flex-col flex-wrap items-start">
                        <h3>Emergency contact</h3>
                        <span>Call: +389 70 123 456</span>
                        <span>Email: help@veterinary-ambulance.dev</span>
                    </section>
                </div>
            </footer>
        </>
    )
}