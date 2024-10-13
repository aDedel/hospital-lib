import {
    AdministerRulesInterface,
    PatientsRegister,
    PatientStatesEnum,
    DrugsEnum,
} from "./patientsRegister";
import { arrayIsIncluded, isArray } from "./utils/utils";

export class Quarantine {
    private drugs: DrugsEnum[];

    /**
     * Define rules at administer drugs to a patient according to his current state - order is important
     * - currentState: Give the current state of the patient so the rule can be applied
     * - drugs: Drugs administrated (only one or an association of drugs, and you can define a list)
     * - newState: Give the new patient state if the rule is applied
     */
    private readonly rules: AdministerRulesInterface[] = [
        {
            // Paracetamol kills subject if mixed with Aspirin
            drugs: [[DrugsEnum.Paracetamol, DrugsEnum.Aspirin]],
            newState: PatientStatesEnum.Dead,
        },
        {
            // If insulin is mixed with antibiotic, healthy people catch Fever
            currentState: PatientStatesEnum.Healthy,
            drugs: [[DrugsEnum.Insulin, DrugsEnum.Antibiotic]],
            newState: PatientStatesEnum.Fever,
        },
        {
            // Aspirin cures Fever | Paracetamol cures Fever
            currentState: PatientStatesEnum.Fever,
            drugs: [DrugsEnum.Aspirin, DrugsEnum.Paracetamol],
            newState: PatientStatesEnum.Healthy,
        },
        {
            // Antibiotic cures Tuberculosis
            currentState: PatientStatesEnum.Tuberculosis,
            drugs: [DrugsEnum.Antibiotic],
            newState: PatientStatesEnum.Healthy,
        },
        {
            // Insulin prevents diabetic subject from dying, does not cure Diabetes
            currentState: PatientStatesEnum.Diabetes,
            drugs: [DrugsEnum.Insulin],
            newState: PatientStatesEnum.Diabetes,
        },
        {
            // Diabetic subject dies without Insulin
            currentState: PatientStatesEnum.Diabetes,
            newState: PatientStatesEnum.Dead,
        },
    ];

    /**
     * Constructor
     */
    constructor(private patients: PatientsRegister) {
        // Init drugs
        this.drugs = [];
    }

    /**
     * Set drugs
     */
    public setDrugs(drugs: DrugsEnum[]): void {
        this.drugs = drugs;
    }

    /**
     * Administrate drugs and wait 40 days
     */
    public wait40Days(): void {
        // For each patients state
        const states = Object.keys(this.patients) as PatientStatesEnum[];

        // Administer drugs to each patients state
        this.patients = states.reduce<PatientsRegister>(
            (patients, oldState) => {
                const newState = this.administerDrugsAndGetState(
                    oldState,
                    this.drugs,
                );

                // We move patients from old state to new state
                patients[newState] =
                    (patients[newState] || 0) + (this.patients[oldState] || 0);
                // Init current state to 0
                if (newState !== oldState && !patients[oldState]) {
                    patients[oldState] = 0;
                }

                return patients;
            },
            {},
        );
    }

    /**
     * Make report
     */
    public report(): PatientsRegister {
        return { ...this.patients };
    }

    /**
     * Administrate drugs and get new state
     */
    protected administerDrugsAndGetState(
        currentState: PatientStatesEnum,
        drugs: DrugsEnum[],
    ): PatientStatesEnum {
        const finalRule = this.rules.find((rule) => {
            // Current state match this rule?
            const matchCurrentState =
                !rule.currentState ||
                (isArray(rule.currentState) &&
                    rule.currentState.includes(currentState)) ||
                rule.currentState === currentState;

            // Drugs administrer match this rule?
            const matchDrugs = rule.drugs
                ? rule.drugs.some((ruleDrugs) => {
                      if (!isArray(ruleDrugs)) {
                          ruleDrugs = [ruleDrugs];
                      }

                      return arrayIsIncluded(ruleDrugs, drugs);
                  })
                : true;

            // Return if rule can be applied or not
            return matchCurrentState && matchDrugs;
        });

        // By default, return current state
        return finalRule?.newState || currentState;
    }
}
