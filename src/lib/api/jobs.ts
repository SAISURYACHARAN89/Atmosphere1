import axiosClient from "./axiosClient";
import { JOB_ENDPOINTS } from "./endpoints";

export async function fetchJobs(limit = 20, skip = 0) {
  return axiosClient.get(JOB_ENDPOINTS.LIST, {
    params: { limit, skip },
  });
}

export async function getJob(jobId: string) {
  return axiosClient.get(JOB_ENDPOINTS.DETAIL(jobId));
}

export async function createJob(payload: unknown) {
  return axiosClient.post(JOB_ENDPOINTS.LIST, payload);
}

export async function updateJob(jobId: string, payload: unknown) {
  return axiosClient.put(JOB_ENDPOINTS.DETAIL(jobId), payload);
}

export async function deleteJob(jobId: string) {
  return axiosClient.delete(JOB_ENDPOINTS.DETAIL(jobId));
}

export async function applyToJob(jobId: string, payload: unknown) {
  return axiosClient.post(JOB_ENDPOINTS.APPLY(jobId), payload);
}

export async function getMyAppliedJobs() {
  return axiosClient.get(JOB_ENDPOINTS.MY_APPLIED);
}

export async function getMyPostedJobs() {
  return axiosClient.get(JOB_ENDPOINTS.MY_POSTED);
}

export async function getJobApplicants(jobId: string) {
  return axiosClient.get(JOB_ENDPOINTS.APPLICANTS(jobId));
}

export async function exportJobApplicants(jobId: string) {
  return axiosClient.get(
    JOB_ENDPOINTS.EXPORT_APPLICANTS(jobId),
    { responseType: "blob" }
  );
}
