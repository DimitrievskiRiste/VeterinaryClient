"use client";
import MembersTemplate from "@/Components/MembersTemplate";
import {useState, useEffect, FC, memo, Suspense} from "react";
import PageLoading from "@/Components/PageLoading";
import EditPetVaccine from "@/Components/EditPetVaccine";
type AddVaccinePageProps = {
    pet:bigint;
}
const AddVaccinePage:FC = memo<AddVaccinePageProps>(function AddVaccinePage({pet}) {
    const [petInt] = useState(pet);
    const [petData, setPetData] = useState(null);
    const [vaccines, setVaccines] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [userData, setUserData] = useState(null);
    useEffect(() => {
        async function fetchVaccines() {
            const response = await fetch("/api/vaccine/all");
            const data = await response.json();
            if(data){
                setVaccines(data.data.value);
            }
        }
        async function getPet() {
            const response = await fetch("/api/pets/find?id=" + petInt);
            const data = await response.json();
            if(data){
                console.log(data);
                setPetData(data.data);
            }
        }
        fetchVaccines();
        getPet();
    }, []);
    return (
        <>
            <Suspense name="MembersTemplate" fallback={<PageLoading/>}>
                <MembersTemplate data={setUserData}>
                    {!userData || !petData ? (
                        <>
                            <PageLoading/>
                        </>
                    ) : (
                        <>
                            {!userData.group.isAdminGroup ? (
                                <>
                                    <p>Sorry, you are not authorized to add new vaccines!</p>
                                </>
                            ) : (
                                <Suspense name="AddOrEditPetVaccine" fallback={<PageLoading/>}>
                                    <div className="flex block flex-col space-y-1 w-[100%] flex-wrap">
                                        <EditPetVaccine pet={petData} data={{}}/>
                                    </div>
                                </Suspense>
                            )}
                        </>
                    )}
                </MembersTemplate>
            </Suspense>
        </>
    )
});
export default AddVaccinePage;