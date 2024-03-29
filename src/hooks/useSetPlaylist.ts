import { useSetRecoilState } from "recoil";
import { PlaylistsAtom } from "../state/Playlist";
import { IPlaylist } from "../interfaces/Playlist";
import { UseToastOptions } from "@chakra-ui/react";

export const useSetPlaylist = (toast: (args: UseToastOptions) => void) => {
  const setRecoilState = useSetRecoilState(PlaylistsAtom);

  const setCurrentPlaylist = (playlist: IPlaylist | null) => {
    setRecoilState((oldState) => {
      return {
        ...oldState,
        currentPlaylist: playlist
      }
    });
  }

  const createPlaylist = (title: string) => {
    if (!localStorage.getItem("playlists")) localStorage.setItem("playlists", `[]`);
    setRecoilState((oldState) => {
      const newPlaylist:IPlaylist = {
        title,
        videos: [],
        id: Date.now()
      }
      const playlists = oldState.playlists.concat(newPlaylist);
      localStorage.setItem("playlists", JSON.stringify(playlists));
      toast({
        title: "Playlist creata con successo",
        status: "success",
        duration: 2000
      });
      return {
        ...oldState,
        playlists: playlists
      }
    });
  }

  const deletePlaylist = (id: number) => {
    setRecoilState((oldState) => {
      const filteredPlaylists = oldState.playlists.filter((p) => p.id !== id)
      localStorage.setItem("playlists", JSON.stringify(filteredPlaylists));
      toast({
        title: "Playlist rimossa con successo",
        status: "warning",
        duration: 2000
      });
      return {
        ...oldState,
        playlists: filteredPlaylists
      }
    });
  }

  const editPlaylistTitle = (newTitle: string, id: number) => {
    if (!newTitle.length) return;
    setRecoilState((oldState) => {
      let editedCurrentPlaylist: IPlaylist = { id, videos: [], title: "" };
      const editedPlaylist = oldState.playlists.map((p) => {
        if (p.id === id) {
          const editedPlaylistTitle = {
            ...p,
            title: newTitle
          }
          editedCurrentPlaylist = editedPlaylistTitle;
          return editedPlaylistTitle;
        } else return p;
      })
      toast({
        title: "Titolo modificato con successo",
        status: "success",
        duration: 2000
      });
      localStorage.setItem("playlists", JSON.stringify(editedPlaylist));
      return {
        ...oldState,
        playlists: editedPlaylist,
        currentPlaylist: editedCurrentPlaylist
      }
    });
  }
  return {
    setCurrentPlaylist,
    createPlaylist,
    deletePlaylist,
    editPlaylistTitle
  }
};
