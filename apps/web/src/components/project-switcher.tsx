'use client';

import { useQuery } from '@tanstack/react-query';
import { ChevronsUpDown, PlusCircle } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Fragment } from 'react';

import { listProjects } from '@/http/projects/list-projects';

import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Skeleton } from './ui/skeleton';

const getInitialByName = (name: string) => {
  const initials = name
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase())
    .splice(0, 2)
    .join('');

  return initials;
};

export const ProjectSwitcher = () => {
  const { slug: orgSlug, project: projectSlug } = useParams<{
    slug: string;
    project: string;
  }>();

  const { data: projects, isLoading } = useQuery({
    queryFn: () => listProjects({ orgSlug }),
    queryKey: [orgSlug, 'projects'],
    enabled: !!orgSlug,
  });

  const currentProject = projects?.content.find((project) => {
    if (project.slug === projectSlug) return project;
  });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        disabled={isLoading}
        className="flex w-48 items-center gap-2 rounded p-1 text-sm font-medium outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        {isLoading ? (
          <Fragment>
            <Skeleton className="size-5 shrink-0 rounded-full" />
            <Skeleton className="h-4 w-full" />
          </Fragment>
        ) : (
          <Fragment>
            {!currentProject ? (
              <span className="text-muted-foreground">Select project</span>
            ) : (
              <>
                <Avatar className="size-4">
                  {currentProject.avatarUrl && (
                    <AvatarImage src={currentProject.avatarUrl} alt="" />
                  )}
                  <AvatarFallback>
                    {getInitialByName(currentProject.name)}
                  </AvatarFallback>
                </Avatar>
                <span
                  className="truncate text-left"
                  title={currentProject.name}
                >
                  {currentProject.name}
                </span>
              </>
            )}
          </Fragment>
        )}
        <ChevronsUpDown
          data-disabled={isLoading}
          className={`ml-auto size-4 min-w-5 text-muted-foreground data-[disabled=true]:opacity-50`}
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        alignOffset={-16}
        sideOffset={14}
        className="w-56"
      >
        <DropdownMenuGroup>
          <DropdownMenuLabel>Projects</DropdownMenuLabel>
          {projects?.content.map((project) => {
            const projectPath = String('/organization/')
              .concat(orgSlug)
              .concat('/project/')
              .concat(project.slug);

            return (
              <DropdownMenuItem asChild key={project.id} title={project.name}>
                <Link href={projectPath}>
                  <Avatar className="size-4">
                    {project.avatarUrl && (
                      <AvatarImage src={project.avatarUrl} alt="" />
                    )}
                    <AvatarFallback>
                      {getInitialByName(project.name)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="line-clamp-1">{project.name}</span>
                </Link>
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link
            href={String('/organization/')
              .concat(orgSlug)
              .concat('/create-project')}
          >
            <PlusCircle className="mr-2 size-4" />
            Create new
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
