import react from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { UserProvider } from './contexts/UserContext';
import Login from './views/auth/login';
import Signup from './views/auth/signup';
import Feed from './views/home/dashboard';
import LikedActivity from './views/activity/activity_Likes';
import PostsActivity from './views/activity/activity_posts';

const App: React.FC = () => (
	<UserProvider>
		<BrowserRouter>
			<Routes>
				<Route path="/" Component={Login} />
				<Route path="/login" Component={Login} />
				<Route path="/signup" Component={Signup} />
				<Route path="/feed" Component={Feed} />
				<Route path="/myActivity-likes" Component={LikedActivity} />
				<Route path="/myActivity-posts" Component={PostsActivity} />
			</Routes>
		</BrowserRouter>
	</UserProvider>
);

export default App;
