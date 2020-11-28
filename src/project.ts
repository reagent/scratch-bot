import Axios from "axios";

type Stats = {
  views: number;
  loves: number;
  favorites: number;
  comments: number;
  remixes: number;
};

// ISO8601 timestamps
type History = {
  created: string;
  modified: string;
  shared: string;
};

type ProjectResponse = {
  id: number;
  title: string;
  image: string;
  stats: Stats;
  history: History;
};

export class Project {
  static async latestFor(username: string): Promise<ProjectResponse> {
    const response = await Axios.get<ProjectResponse[]>(
      `/users/${username}/projects`,
      {
        baseURL: "https://api.scratch.mit.edu",
      }
    );

    return response.data.sort((a, b) => {
      if (a.history.shared === b.history.shared) {
        return 0;
      }

      return a.history.shared < b.history.shared ? 1 : -1;
    })[0];
  }
}
