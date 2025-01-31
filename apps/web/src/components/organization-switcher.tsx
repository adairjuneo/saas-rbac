import { ChevronsUpDown, PlusCircle } from 'lucide-react';
import { cookies } from 'next/headers';
import Link from 'next/link';

import { listOrganizations } from '@/http/organizations/list-organizations';

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

export const OrganizationSwitcher = async () => {
  const cookiesStore = await cookies();
  const currentOrgSlug = cookiesStore.get('org')?.value;

  const { content } = await listOrganizations();

  const currentOrganization = content.find(
    (org) => org.slug === currentOrgSlug
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex w-48 items-center gap-2 rounded p-1 text-sm font-medium outline-none focus-visible:ring-2 focus-visible:ring-primary">
        {!currentOrganization ? (
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
        )}
        <ChevronsUpDown className="ml-auto size-4 min-w-5 text-muted-foreground" />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        alignOffset={-16}
        sideOffset={14}
        className="w-56"
      >
        <DropdownMenuGroup>
          <DropdownMenuLabel>Organizations</DropdownMenuLabel>
          {content.map((organization) => {
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
          })}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/create-organization">
            <PlusCircle className="mr-2 size-4" />
            Create new
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
