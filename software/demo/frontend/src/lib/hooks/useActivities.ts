import { useQuery } from "@tanstack/react-query";
import type { Activity } from "../types";
import agent from "../api/agent";

export const useActivities = () => {
  const { data: activities, isPending } = useQuery({
    queryKey: ["activities"],
    queryFn: async () => {
      const response = await agent.get<Activity[]>("/activities");
      return response.data;
    },
  });

  return { activities, isPending };
};
