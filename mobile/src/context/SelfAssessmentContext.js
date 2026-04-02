import React, { createContext, useState, useCallback } from 'react';
import selfAssessmentService from '../api/selfAssessmentService';

export const SelfAssessmentContext = createContext();

export function SelfAssessmentProvider({ children }) {
  const [assessments, setAssessments] = useState([]);
  const [currentAssessment, setCurrentAssessment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadAssessments = useCallback(async (addictionId = null) => {
    try {
      setLoading(true);
      setError(null);
      const data = await selfAssessmentService.getAssessments(addictionId);
      setAssessments(data || []);
      return data;
    } catch (err) {
      console.error('Error loading assessments:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const createAssessment = useCallback(async (addictionId, responses, score) => {
    try {
      setError(null);
      const newAssessment = await selfAssessmentService.createAssessment(
        addictionId,
        responses,
        score
      );
      setAssessments([newAssessment, ...assessments]);
      setCurrentAssessment(newAssessment);
      return newAssessment;
    } catch (err) {
      console.error('Error creating assessment:', err);
      setError(err.message);
      throw err;
    }
  }, [assessments]);

  const getLatestAssessment = useCallback(async (addictionId = null) => {
    try {
      setError(null);
      const assessment = await selfAssessmentService.getLatestAssessment(addictionId);
      setCurrentAssessment(assessment);
      return assessment;
    } catch (err) {
      console.error('Error fetching latest assessment:', err);
      setError(err.message);
    }
  }, []);

  return (
    <SelfAssessmentContext.Provider value={{
      assessments,
      currentAssessment,
      loading,
      error,
      loadAssessments,
      createAssessment,
      getLatestAssessment
    }}>
      {children}
    </SelfAssessmentContext.Provider>
  );
}

export const useSelfAssessment = () => {
  const context = React.useContext(SelfAssessmentContext);
  if (!context) {
    throw new Error('useSelfAssessment must be used within SelfAssessmentProvider');
  }
  return context;
};
