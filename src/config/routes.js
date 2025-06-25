import AllTasks from '@/components/pages/AllTasks';
import Today from '@/components/pages/Today';
import Upcoming from '@/components/pages/Upcoming';
import Projects from '@/components/pages/Projects';
import Completed from '@/components/pages/Completed';
import Dashboard from '@/components/pages/Dashboard';
import TaskDependencies from '@/components/pages/TaskDependencies';

export const routes = {
  allTasks: {
    id: 'allTasks',
    label: 'All Tasks',
    path: '/tasks',
    icon: 'List',
    component: AllTasks
  },
  today: {
    id: 'today',
    label: 'Today',
    path: '/today',
    icon: 'Calendar',
    component: Today
  },
  upcoming: {
    id: 'upcoming',
    label: 'Upcoming',
    path: '/upcoming',
    icon: 'Clock',
    component: Upcoming
  },
  projects: {
    id: 'projects',
    label: 'Projects',
    path: '/projects',
    icon: 'Folder',
    component: Projects
  },
  completed: {
    id: 'completed',
    label: 'Completed',
    path: '/completed',
    icon: 'CheckCircle',
    component: Completed
  },
dashboard: {
    id: 'dashboard',
    label: 'Dashboard',
    path: '/dashboard',
    icon: 'BarChart3',
    component: Dashboard
  },
  dependencies: {
    id: 'dependencies',
    label: 'Dependencies',
    path: '/dependencies',
    icon: 'Link',
    component: TaskDependencies
  }
};

export const routeArray = Object.values(routes);