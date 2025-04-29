import {LoadingLoop} from "@/Components/Icons";

export default function PageLoading()
{
    return (
        <>
            <div className="flex relative h-[500px] md:h-[700px] rounded-md justify-center items-center p-5 w-[100%] content-center">
                <div className="block p-5">
                    <LoadingLoop/>
                </div>
            </div>
        </>
    )
}