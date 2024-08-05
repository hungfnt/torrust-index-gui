import { type TorrentResponse, type PublicSettings } from "torrust-index-types-lib";
import { useRestApi, useSettings, useUser } from "~/composables/states";

export function isTrackerPublic (): boolean {
  return !isTrackerPrivate();
}

export function isTrackerPrivate (): boolean {
  const settings = useSettings();
  return settings.value.tracker_private === true;
}

export function isUserLoggedIn (): boolean {
  return !!useUser().value?.username;
}

export function canEditThisTorrent (torrent: TorrentResponse): boolean {
  const user = useUser().value;

  if (!user?.username) {
    return false;
  }

  return user.admin || user.username === torrent.uploader;
}

export function downloadTorrent (infoHash: string, fileName?: string) {
  if (fileName === undefined) {
    fileName = "torrent";
  }

  useRestApi().value.torrent.downloadTorrent(infoHash)
    .then((blob: Blob) => {
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${fileName}.torrent`);
      document.body.appendChild(link);
      link.click();
    });
}

export function fileSizeDecimal (size: number): string {
  if (!size) { size = 0; }
  let sizeString = `${(size).toFixed(2)} B`;

  if (size / Math.pow(1000, 3) < 1000) { sizeString = `${(size / Math.pow(1000, 3)).toFixed(2)} GB`; }
  if (size / Math.pow(1000, 2) < 1000) { sizeString = `${(size / Math.pow(1000, 2)).toFixed(2)} MB`; }
  if (size / Math.pow(1000, 1) < 1000) { sizeString = `${(size / Math.pow(1000, 1)).toFixed(2)} KB`; }

  return sizeString;
}

export function fileSizeBinary (size: number): string {
  if (!size) { size = 0; }
  let sizeString = `${(size).toFixed(2)} B`;

  if (size / Math.pow(1024, 3) < 1024) { sizeString = `${(size / Math.pow(1024, 3)).toFixed(2)} GiB`; }
  if (size / Math.pow(1024, 2) < 1024) { sizeString = `${(size / Math.pow(1024, 2)).toFixed(2)} MiB`; }
  if (size / Math.pow(1024, 1) < 1024) { sizeString = `${(size / Math.pow(1024, 1)).toFixed(2)} KiB`; }

  return sizeString;
}

export function timeSince (date: Date): string {
  // convert datetime to unix timestamp
  const unix = Math.floor(date.getTime() / 1000);

  const seconds = Math.floor(((+new Date() / 1000) - unix));
  let interval = Math.floor(seconds / 31536000);
  if (interval >= 1) {
    return `${interval} year${(interval > 1 ? "s" : "")}`;
  }
  interval = Math.floor(seconds / 2592000);
  if (interval >= 1) {
    return `${interval} month${(interval > 1 ? "s" : "")}`;
  }
  interval = Math.floor(seconds / 86400);
  if (interval >= 1) {
    return `${interval} day${(interval > 1 ? "s" : "")}`;
  }
  interval = Math.floor(seconds / 3600);
  if (interval >= 1) {
    return `${interval} hour${(interval > 1 ? "s" : "")}`;
  }
  interval = Math.floor(seconds / 60);
  if (interval >= 1) {
    return `${interval} minute${(interval > 1 ? "s" : "")}`;
  }
  return `${Math.floor(seconds)} seconds`;
}
