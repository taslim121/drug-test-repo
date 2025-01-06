import React from 'react';

import { Redirect } from 'expo-router';

import { useAuth } from '../../../provider/AuthProvider';

import DrugInteractionList from '../../../components/DrugInteractionList';

const PatientDrugDetails: React.FC = () => {
return <DrugInteractionList tableName="patient_interactions" />;
};

export default PatientDrugDetails;