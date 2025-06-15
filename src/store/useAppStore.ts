import { create } from 'zustand';
import { Doctor, Consultation, MedicalRecord } from '../types';

interface AppState {
  doctors: Doctor[];
  consultations: Consultation[];
  medicalRecords: MedicalRecord[];
  selectedDoctor: Doctor | null;
  setDoctors: (doctors: Doctor[]) => void;
  setConsultations: (consultations: Consultation[]) => void;
  setMedicalRecords: (records: MedicalRecord[]) => void;
  setSelectedDoctor: (doctor: Doctor | null) => void;
  addConsultation: (consultation: Consultation) => void;
  addMedicalRecord: (record: MedicalRecord) => void;
}

export const useAppStore = create<AppState>((set) => ({
  doctors: [],
  consultations: [],
  medicalRecords: [],
  selectedDoctor: null,
  setDoctors: (doctors) => set({ doctors }),
  setConsultations: (consultations) => set({ consultations }),
  setMedicalRecords: (records) => set({ medicalRecords: records }),
  setSelectedDoctor: (doctor) => set({ selectedDoctor: doctor }),
  addConsultation: (consultation) => 
    set((state) => ({ consultations: [...state.consultations, consultation] })),
  addMedicalRecord: (record) => 
    set((state) => ({ medicalRecords: [...state.medicalRecords, record] })),
}));
