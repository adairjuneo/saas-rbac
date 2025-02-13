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

export default function ProjectsList() {
  return (
    <div className="mt-4 grid grid-cols-3 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Project 01</CardTitle>
          <CardDescription className="line-clamp-2 leading-relaxed">
            Accumsan nonumy sanctus clita magna aliquam erat sed suscipit kasd
            eirmod sit ipsum gubergren. Kasd duo doming at nobis blandit laoreet
            et sed sed gubergren sit.
          </CardDescription>
        </CardHeader>
        <CardFooter className="flex items-center gap-1.5">
          <Avatar className="size-4">
            <AvatarImage src="https://github.com/devjuneo.png" />
            <AvatarFallback>DJ</AvatarFallback>
          </Avatar>
          <span className="text-xs text-muted-foreground">
            Created by{' '}
            <span className="font-medium text-foreground">Adair Juneo</span> a
            day ago
          </span>

          <Button size="sm" variant="ghost" className="ml-auto">
            View <ArrowRight className="ml-1 size-3" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
