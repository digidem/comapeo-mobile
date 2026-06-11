import * as React from 'react';
import {useClientApi} from '@comapeo/core-react';
import type {MapeoClientApi} from '@comapeo/ipc';
import {QueryClient, useQueryClient} from '@tanstack/react-query';

// Matches @comapeo/core-react's getProjectsQueryKey(), which is not exported
const PROJECTS_QUERY_KEY = ['@comapeo/core-react', 'projects'];

// Shared across all callers so that concurrent "no default project exists"
// checks result in exactly one project being created (see issue #1940)
const inFlightCreates = new WeakMap<MapeoClientApi, Promise<string>>();

export type EnsureDefaultProjectOptions = {
  /**
   * Project to ignore when looking for a project to switch to, e.g. the
   * project currently being left.
   */
  excludeProjectId?: string;
};

/**
 * Returns the ID of the project that should become (or stay) the active
 * project when the current one is left or removed: the default (unnamed)
 * project if one exists, otherwise a newly created one, falling back to any
 * other joined project if creation fails. Reads a fresh project list rather
 * than the query cache, so it is safe to call from mutation callbacks.
 */
export function useEnsureDefaultProject(): (
  opts?: EnsureDefaultProjectOptions,
) => Promise<string> {
  const clientApi = useClientApi();
  const queryClient = useQueryClient();

  return React.useCallback(
    (opts: EnsureDefaultProjectOptions = {}) =>
      ensureDefaultProject({clientApi, queryClient, ...opts}),
    [clientApi, queryClient],
  );
}

async function ensureDefaultProject({
  clientApi,
  queryClient,
  excludeProjectId,
}: {
  clientApi: MapeoClientApi;
  queryClient: QueryClient;
} & EnsureDefaultProjectOptions): Promise<string> {
  const projects = await clientApi.listProjects();
  const candidates = projects.filter(
    project =>
      project.status === 'joined' && project.projectId !== excludeProjectId,
  );

  const existingDefault = candidates.find(project => !project.name);
  if (existingDefault) return existingDefault.projectId;

  let createPromise = inFlightCreates.get(clientApi);
  if (!createPromise) {
    createPromise = clientApi.createProject().finally(() => {
      inFlightCreates.delete(clientApi);
    });
    inFlightCreates.set(clientApi, createPromise);
  }

  try {
    return await createPromise;
  } catch (err) {
    const fallback = candidates[0];
    if (fallback) return fallback.projectId;
    throw err;
  } finally {
    queryClient.invalidateQueries({queryKey: PROJECTS_QUERY_KEY});
  }
}
