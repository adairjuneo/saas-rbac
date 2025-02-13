import { formatDistance } from 'date-fns';
import { ArrowRight } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { getListOfProjects } from './actions';

const getInitialByName = (name: string) => {
  const initials = name
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase())
    .splice(0, 2)
    .join('');

  return initials;
};

export default async function ProjectsList() {
  const projects = await getListOfProjects();

  return (
    <div className="mt-4 grid grid-cols-3 gap-4">
      {projects?.map((project) => {
        return (
          <Card key={project.id} className="flex flex-col justify-between">
            <CardHeader>
              <CardTitle>{project.name}</CardTitle>
              <CardDescription
                title={project.description}
                className="line-clamp-2 leading-relaxed"
              >
                {project.description}
              </CardDescription>
            </CardHeader>
            <CardFooter className="flex items-center gap-1.5">
              <Avatar className="size-4">
                {project.owner.avatarUrl && (
                  <AvatarImage src={project.owner.avatarUrl} />
                )}
                <AvatarFallback>
                  {getInitialByName(project.owner.name || project.name)}
                </AvatarFallback>
              </Avatar>
              <span className="text-xs text-muted-foreground">
                <span className="font-medium text-foreground">
                  {project.owner.name}
                </span>{' '}
                <span title={new Date(project.createdAt).toString()}>
                  {formatDistance(project.createdAt, new Date(), {
                    addSuffix: true,
                  })}
                </span>
              </span>

              <Button size="sm" variant="ghost" className="ml-auto">
                View <ArrowRight className="ml-1 size-3" />
              </Button>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}
