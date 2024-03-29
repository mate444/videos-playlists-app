import { useSetRecoilState } from "recoil";
import { PlaylistsAtom } from "../state/Playlist";
import { IVideo } from "../interfaces/Video";
import { IPlaylist } from "../interfaces/Playlist";
import { UseToastOptions } from "@chakra-ui/react";

// Aggiungi un video ad una playlist specifica
export const useAddVideo = (toast: (args: UseToastOptions) => void) => {
  const setPlaylistVideos = useSetRecoilState(PlaylistsAtom);
  const addVideoToPlaylist = (video: IVideo, playlistId: number) => {
    setPlaylistVideos((oldState) => {
      let currentPlaylist: IPlaylist = { id: playlistId, videos: [], title: "" };
      // Logica per aggiungere/eliminare un video della playlist
      const updatedPlaylists = oldState.playlists.map((p) =>  {
        if (p.id === playlistId) {
          const existingVideoIndex = p.videos.findIndex((v) => v.id.videoId === video.id.videoId);
          if (existingVideoIndex === -1) {
            currentPlaylist = {...p, videos: [...p.videos, video]}
            toast({
              title: "Video aggiunto alla playlist",
              status: "success",
              duration: 2000
            });
            return {
              ...p,
              videos: [...p.videos, video],
            };
          } else {
            const updatedPlaylist = {
              ...p,
              videos: [...p.videos]
            }
            updatedPlaylist.videos.splice(existingVideoIndex, 1);
            currentPlaylist = updatedPlaylist;
            toast({
              title: "Video rimosso dalla playlist",
              status: "warning",
              duration: 2000
            });
            return updatedPlaylist;
          }
        } else {
          return p;
        }
      });   
      localStorage.setItem("playlists", JSON.stringify(updatedPlaylists));
      return {
        ...oldState,
        playlists: updatedPlaylists,
        currentPlaylist
      }
    });
  }

  const removeVideoFromPlaylist = (video: IVideo) => {
    setPlaylistVideos((oldState) => {
      const playlistId = oldState.currentPlaylist?.id;
      let currentPlaylist: IPlaylist = { id: 0, videos: [], title: "" };
      const updatedPlaylists = oldState.playlists.map((p) => {
        if (p.id === playlistId) {
          const removedVideo = {
            ...p,
            videos: p.videos.filter((v) => v.id.videoId !== video.id.videoId)
          }
          currentPlaylist = removedVideo
          return removedVideo
        } else return p;
      });
      localStorage.setItem("playlists", JSON.stringify(updatedPlaylists));
      toast({
        title: "Video rimosso dalla playlist",
        status: "warning",
        duration: 2000
      });
      return {
        ...oldState,
        playlists: updatedPlaylists,
        currentPlaylist
      }
    })
  }

  return {
    addVideoToPlaylist,
    removeVideoFromPlaylist
  }
}
