/**
 * useYouTubeChannel — YouTube Data API v3 Integration Hook
 * ──────────────────────────────────────────────────────────────
 * Fetches channel data (live status, recent videos, subscriber count)
 * with aggressive sessionStorage caching to protect API quota.
 *
 * Cache TTL: 2 hours. No API call is made if valid cache exists.
 * Graceful degradation: error state populated on failure, UI shows fallback.
 */

import { useState, useEffect, useCallback } from "react";
import { useTenant } from "@/contexts/TenantContext";

// ── Types ─────────────────────────────────────────────────────

export interface YouTubeVideo {
  id: string;
  title: string;
  thumbnail: string;
  publishedAt: string;
  viewCount: string;
  isLive: boolean;
}

export interface YouTubeChannelData {
  liveVideo: YouTubeVideo | null;
  latestVideos: YouTubeVideo[];
  subscriberCount: string;
  channelTitle: string;
  channelThumbnail: string;
}

interface CacheEntry {
  data: YouTubeChannelData;
  timestamp: number;
}

interface UseYouTubeChannelReturn {
  data: YouTubeChannelData | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

// ── Constants ─────────────────────────────────────────────────

const CACHE_TTL_MS = 2 * 60 * 60 * 1000; // 2 hours
const YT_API_BASE = "https://www.googleapis.com/youtube/v3";

// ── Helpers ───────────────────────────────────────────────────

// Bump cache key version to bust old broken caches
function getCacheKey(channelId: string): string {
  return `yt_cache_v2_${channelId}`;
}

function getCache(channelId: string): YouTubeChannelData | null {
  try {
    const raw = sessionStorage.getItem(getCacheKey(channelId));
    if (!raw) return null;
    const entry: CacheEntry = JSON.parse(raw);
    if (Date.now() - entry.timestamp > CACHE_TTL_MS) {
      sessionStorage.removeItem(getCacheKey(channelId));
      return null;
    }
    return entry.data;
  } catch {
    return null;
  }
}

function setCache(channelId: string, data: YouTubeChannelData): void {
  try {
    const entry: CacheEntry = { data, timestamp: Date.now() };
    sessionStorage.setItem(getCacheKey(channelId), JSON.stringify(entry));
  } catch {
    // sessionStorage full or disabled — ignore
  }
}

function formatCount(count: string | number): string {
  const n = typeof count === "string" ? parseInt(count, 10) : count;
  if (isNaN(n)) return "0";
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1).replace(/\.0$/, "")}K`;
  return n.toString();
}

// ── Hook ──────────────────────────────────────────────────────

export function useYouTubeChannel(): UseYouTubeChannelReturn {
  const { config } = useTenant();
  const channelId = config.social.youtubeChannelId;
  const apiKey = config.youtubeApiKey;

  const [data, setData] = useState<YouTubeChannelData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async (skipCache = false) => {
    if (!channelId || !apiKey) {
      setError("YouTube API key or Channel ID not configured.");
      setLoading(false);
      return;
    }

    // Check cache first
    if (!skipCache) {
      const cached = getCache(channelId);
      if (cached) {
        setData(cached);
        setLoading(false);
        setError(null);
        return;
      }
    }

    setLoading(true);
    setError(null);

    try {
      // 1. Fetch channel info (subscriber count, title, thumbnail)
      const channelRes = await fetch(
        `${YT_API_BASE}/channels?` +
        new URLSearchParams({
          part: "snippet,statistics",
          id: channelId,
          key: apiKey,
        })
      );

      if (!channelRes.ok) {
        throw new Error(`YouTube API error (channels): ${channelRes.status}`);
      }

      const channelJson = await channelRes.json();
      const channel = channelJson.items?.[0];

      if (!channel) {
        throw new Error("Channel not found in API response");
      }

      const channelTitle = channel.snippet?.title || "";
      // Grab medium or default URL for channel avatar
      const channelThumbnail = channel.snippet?.thumbnails?.medium?.url || channel.snippet?.thumbnails?.default?.url || channel.snippet?.thumbnails?.high?.url || "";
      const subscriberCount = formatCount(channel.statistics?.subscriberCount || "0");

      // 2. Search for active live stream
      const liveRes = await fetch(
        `${YT_API_BASE}/search?` +
        new URLSearchParams({
          part: "snippet",
          channelId,
          eventType: "live",
          type: "video",
          maxResults: "1",
          key: apiKey,
        })
      );

      let liveVideo: YouTubeVideo | null = null;
      if (liveRes.ok) {
        const liveJson = await liveRes.json();
        const liveItem = liveJson.items?.[0];
        if (liveItem && liveItem.id?.videoId) {
          liveVideo = {
            id: liveItem.id.videoId,
            title: liveItem.snippet?.title || "",
            thumbnail: liveItem.snippet?.thumbnails?.medium?.url || liveItem.snippet?.thumbnails?.high?.url || "",
            publishedAt: liveItem.snippet?.publishedAt || "",
            viewCount: "", // search endpoint doesn't return views
            isLive: true,
          };
        }
      }

      // 3. Fetch latest videos
      const videosRes = await fetch(
        `${YT_API_BASE}/search?` +
        new URLSearchParams({
          part: "snippet",
          channelId,
          order: "date",
          type: "video",
          maxResults: "8",
          key: apiKey,
        })
      );

      if (!videosRes.ok) {
        throw new Error(`YouTube API error (search videos): ${videosRes.status}`);
      }

      const videosJson = await videosRes.json();
      const videoIds = (videosJson.items || [])
        .map((item: any) => item.id?.videoId)
        .filter(Boolean)
        .join(",");

      // 4. Fetch video statistics for view counts
      let videoStatsMap: Record<string, string> = {};
      if (videoIds) {
        const statsRes = await fetch(
          `${YT_API_BASE}/videos?` +
          new URLSearchParams({
            part: "statistics",
            id: videoIds,
            key: apiKey,
          })
        );
        if (statsRes.ok) {
          const statsJson = await statsRes.json();
          for (const item of statsJson.items || []) {
            videoStatsMap[item.id] = formatCount(item.statistics?.viewCount || "0");
          }
        }
      }

      // STRICT MAPPING: Must use item.id.videoId and item.snippet.thumbnails.medium.url
      const latestVideos: YouTubeVideo[] = (videosJson.items || [])
        .map((item: any) => {
          const videoId = item.id?.videoId;
          if (!videoId) return null; // skip entries that are not videos (e.g. playlists)
          
          return {
            id: videoId,
            title: item.snippet?.title || "",
            thumbnail: item.snippet?.thumbnails?.medium?.url || item.snippet?.thumbnails?.default?.url || "",
            publishedAt: item.snippet?.publishedAt || "",
            viewCount: videoStatsMap[videoId] || "0",
            isLive: item.snippet?.liveBroadcastContent === "live" || item.snippet?.liveBroadcastContent === "upcoming",
          };
        })
        .filter(Boolean) as YouTubeVideo[];

      // Filter out the live video from the latest list if it's already returned to avoid duplicates
      const filteredLatestVideos = liveVideo 
        ? latestVideos.filter(v => v.id !== liveVideo?.id)
        : latestVideos;

      const result: YouTubeChannelData = {
        liveVideo,
        latestVideos: filteredLatestVideos,
        subscriberCount,
        channelTitle,
        channelThumbnail,
      };

      setCache(channelId, result);
      setData(result);
      setError(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      console.error("YouTube API Fetch Error:", message);
      setError(message);
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [channelId, apiKey]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refetch = useCallback(() => {
    fetchData(true);
  }, [fetchData]);

  return { data, loading, error, refetch };
}
