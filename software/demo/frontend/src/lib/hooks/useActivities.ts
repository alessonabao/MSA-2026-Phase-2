import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Activity, AttendanceStatus } from "../types";
import agent from "../api/agent";
import { useAccount } from "./useAccount";
import { useLocation } from "react-router";

export const useActivities = (id?: string) => {
  const queryClient = useQueryClient();
  const location = useLocation();
  const { currentUser } = useAccount();

  const { data: activity, isLoading: isLoadingActivity } = useQuery({
    queryKey: ["activities", id],
    queryFn: async () => {
      const response = await agent.get<Activity>(`/activities/${id}`);
      return response.data;
    },
    enabled: !!id && !!currentUser,
  });

  // create activity
  const createActivity = useMutation({
    mutationFn: async (activity: Activity) => {
      const response = await agent.post("/activities", activity);
      return response.data;
    },
    onError: (error) => {
      console.error("Create activity failed:", error);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["activities"],
      });
    },
  });

  // read activity
  const { data: activities, isLoading } = useQuery({
    queryKey: ["activities"],
    queryFn: async () => {
      const response = await agent.get<Activity[]>("/activities");
      return response.data;
    },
    enabled: !id && location.pathname === "/activities" && !!currentUser,
  });

  // update activity
  const updateActivity = useMutation({
    mutationFn: async (activity: Activity) => {
      await agent.put("/activities", activity);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["activities"],
      });
    },
  });

  // delete activity
  const deleteActivity = useMutation({
    mutationFn: async (id: string) => {
      await agent.delete(`/activities/${id}`);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["activities"],
      });
    },
  });

  // the current member's own RSVP status for this activity - server state (persisted in the
  // ActivityAttendance table), so it lives here alongside the rest of the activity data rather
  // than as local component state.
  const { data: attendance, isLoading: isLoadingAttendance } = useQuery({
    queryKey: ["activities", id, "attendance"],
    queryFn: async () => {
      const response = await agent.get<AttendanceStatus>(
        `/activities/${id}/attendance`,
      );
      return response.data;
    },
    enabled: !!id && !!currentUser,
  });

  const joinActivity = useMutation({
    mutationFn: async (activityId: string) => {
      const response = await agent.post<AttendanceStatus>(
        `/activities/${activityId}/join`,
      );
      return response.data;
    },
    onSuccess: async (data, activityId) => {
      queryClient.setQueryData(["activities", activityId, "attendance"], data);
      // joining can cross a badge threshold (1st/5th/10th event) - refresh the
      // profile so newly-earned badges show up without a manual reload.
      await queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });

  const cancelAttendance = useMutation({
    mutationFn: async (activityId: string) => {
      const response = await agent.post<AttendanceStatus>(
        `/activities/${activityId}/cancel-attendance`,
      );
      return response.data;
    },
    onSuccess: async (data, activityId) => {
      queryClient.setQueryData(["activities", activityId, "attendance"], data);
      await queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });

  return {
    activity,
    activities,
    isLoading,
    isLoadingActivity,
    createActivity,
    updateActivity,
    deleteActivity,
    attendance,
    isLoadingAttendance,
    joinActivity,
    cancelAttendance,
  };
};
