import { Router, Route, RootRoute } from '@tanstack/react-router';
import Feed from './pages/Feed';
import RepoFeed from './pages/RepoFeed';
import CommitDetail from './pages/CommitDetail';

const rootRoute = new RootRoute({
  component: Feed,
});

const repoRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/repo/$name',
  component: RepoFeed,
});

const commitRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/commit/$sha',
  component: CommitDetail,
});

const routeTree = rootRoute.addChildren([repoRoute, commitRoute]);

const router = new Router({ routeTree });

function App() {
  return <router.RouterProvider />;
}

export default App;
