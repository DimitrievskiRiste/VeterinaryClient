import {Suspense} from "react";
import PageLoading from "@/Components/PageLoading";
import AddVaccinePage from "@/Components/pages/AddVaccinePage";

export default async function AddVaccine({params}:Promise<{params:{id:bigint}}>){
    const p = await params;
    const id = parseInt(p.id);
    return (
        <>
            {console.log(id)}
            <Suspense fallback={<PageLoading/>} name="AddVaccinePage">
                <AddVaccinePage pet={id}/>
            </Suspense>
        </>
    )
}