export enum PatientStatesEnum {
    Fever = "F",
    Healthy = "H",
    Diabetes = "D",
    Tuberculosis = "T",
    Dead = "X",
}

export enum DrugsEnum {
    Aspirin = "As",
    Antibiotic = "An",
    Insulin = "I",
    Paracetamol = "P",
}

export type PatientsRegister = {
    [key in PatientStatesEnum]?: number;
};

export interface AdministerRulesInterface {
    currentState?: PatientStatesEnum | PatientStatesEnum[];
    drugs?: (DrugsEnum | DrugsEnum[])[];
    newState: PatientStatesEnum;
}
