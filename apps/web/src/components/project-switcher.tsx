'use client';

import { useQuery } from '@tanstack/react-query';
import { ChevronsUpDown, PlusCircle } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

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

const getInitialByName = (name: string) => {
  const initials = name
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase())
    .splice(0, 2)
    .join('');

  return initials;
};

export const ProjectSwitcher = () => {
  const { slug: orgSlug } = useParams<{ slug: string }>();

  const { data: content, isLoading } = useQuery({
    queryFn: () => listProjects({ orgSlug }),
    queryKey: [orgSlug, 'projects'],
    enabled: !!orgSlug,
  });

  console.log('projects =>> ', content);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        disabled={isLoading}
        className="flex w-48 items-center gap-2 rounded p-1 text-sm font-medium outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        <span className="text-muted-foreground">Select project</span>
        {/* {!currentOrganization ? (
          <span className="text-muted-foreground">Select organization</span>
        ) : (
          <>
            <Avatar className="mr-2 size-4">
              {currentOrganization.avatarUrl && (
                <AvatarImage src={currentOrganization.avatarUrl} alt="" />
              )}
              <AvatarFallback>
                {getInitialByName(currentOrganization.name)}
              </AvatarFallback>
            </Avatar>
            <span
              className="truncate text-left"
              title={currentOrganization.name}
            >
              {currentOrganization.name}
            </span>
          </>
        )} */}
        <ChevronsUpDown className="ml-auto size-4 min-w-5 text-muted-foreground" />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        alignOffset={-16}
        sideOffset={14}
        className="w-56"
      >
        <DropdownMenuGroup>
          <DropdownMenuLabel>Projects</DropdownMenuLabel>
          <DropdownMenuItem asChild key={'id'} title={'name'}>
            <Link href="#">
              <Avatar className="mr-2 size-4">
                <AvatarFallback>
                  {getInitialByName('Project Test')}
                </AvatarFallback>
              </Avatar>
              <span className="line-clamp-1">Projects Test</span>
            </Link>
          </DropdownMenuItem>
          {/* {content.map((organization) => {
            const orgPath = String('/organization/').concat(organization.slug);

            return (
              <DropdownMenuItem
                asChild
                key={organization.id}
                title={organization.name}
              >
                <a href={orgPath}>
                  <Avatar className="mr-2 size-4">
                    {organization.avatarUrl && (
                      <AvatarImage src={organization.avatarUrl} alt="" />
                    )}
                    <AvatarFallback>
                      {getInitialByName(organization.name)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="line-clamp-1">{organization.name}</span>
                </a>
              </DropdownMenuItem>
            );
          })} */}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="#">
            <PlusCircle className="mr-2 size-4" />
            Create new
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
