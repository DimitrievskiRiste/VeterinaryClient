import {FC, memo, useEffect, useState} from "react";
import AnimatedInput from "@/Components/AnimatedInput";
import PageLoading from "@/Components/PageLoading";
import {LoadingLoop} from "@/Components/Icons";
import Button from "@/Components/Button";
type PetVaccine = {
    pet:object;
    data:any;
    formdata:null|object;
}
const EditPetVaccine:FC = memo<PetVaccine>(function EditPetVaccine({pet, data, formdata}){
    const [petData, setPetData] = useState(pet);
    const [vaccinationData, setVaccinationData] = useState(data);
    const [vaccines, setVaccines] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState(formdata);
    const [formErrors, setFormErrors] = useState({
        PetId: null,
        VaccineId: null,
        DateAdded: null
    });

    useEffect(() => {
        async function fetchVaccines() {
            const response = await fetch("/api/vaccine/all");
            const data = await response.json();
            if(data){
                setVaccines(data.data.value);
            } else {
                console.error("Failed to load vaccines");
            }
        }
        fetchVaccines();
    }, []);
    const SetVaccine = (e:React.ChangeEvent<HTMLSelectElement>) => {
        const {name, value} = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    }
    const SetDate = (e:React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        const dateNow = new Date();
        const date = new Date(value);
        if(date > dateNow){
            setFormErrors((prev) => ({...prev, [name]: "Date cannot be in the future"}));
            return;
        }
        setFormErrors((prev) => ({...prev, [name]: null}));
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    }
    useEffect(() => {
        setFormData((prev) => ({...prev, PetId: petData.id}));
    }, [petData]);
    const handleForm = async (e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if(!formData.PetId || !formData.VaccineId || !formData.DateAdded){
            alert("Please fill all fields");
            return;
        }
        if(formErrors.PetId || formErrors.VaccineId || formErrors.DateAdded) {
            alert("Please fix all errors before submitting the form!");
            return;
        }
        setIsLoading(true);
        if(!formdata){
            const response = await fetch("/api/pets/vaccine/add", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            });
            const data = await response.json();
            if(data.status !== 200){
                alert("Failed to add vaccine");
                setIsLoading(false);
                return;
            }
            alert("Vaccine added successfully");
            setIsLoading(false);
        }
    }

    return (
        <>
            <form onSubmit={handleForm} role="form" className="w-[100%] p-10">
                <div className="flex flex-col flex-wrap space-y-1 w-[100%] items-start">
                    <div className="flex flex-row space-x-1 items-center w-[100%]">
                        <span className="font-extrabold">Add or edit vaccine for pet {pet.name}</span>
                    </div>
                    {vaccines.length < 1 ? (
                        <>
                            <LoadingLoop/>
                        </>
                    ) : (
                        <>
                            <AnimatedInput type="select" label="Select vaccine"  defaultValue={data?.vaccine?.vaccineId} className="control-input rounded-md w-[100%]" name="VaccineId" onChange={SetVaccine}>
                                <option value="">-- Select vaccine --</option>
                                {vaccines.map((vaccine) => (
                                    <option key={vaccine.vaccineId} value={vaccine.vaccineId}>{vaccine.name}</option>
                                ))}
                            </AnimatedInput>
                        </>
                    )}
                    <AnimatedInput type="date" label="Vaccination date" name="DateAdded" onChange={SetDate} className="control-input rounded-md w-[100%]"/>
                    {formErrors.DateAdded ? <span className="error-text">{formErrors.DateAdded}</span> : null}
                    <Button type="submit" className="button button-primary w-[100%]" isLoading={isLoading} label="Save Changes"/>
                </div>
            </form>
        </>
    )
});
export default EditPetVaccine;