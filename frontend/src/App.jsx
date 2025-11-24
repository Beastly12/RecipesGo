import './App.css';
import { Routes, Route } from 'react-router-dom';
import RecipeDetailPage from './views/RecipeDetails';
import AuthPage from './views/AuthPage';
import RecipeFeed from './views/RecipesFeed';
import CreateRecipePage from './views/CreateRecipePage';
import Profile from './views/ProfilePage';
import ProfileSettings from './views/ProfileSettings';
import DashBoard from './views/DashBoard';
import { Amplify } from 'aws-amplify';
import useDarkMode from './hooks/useDarkMode';
import '@ant-design/v5-patch-for-react-19';
import Public from './routes/PublicRoutes';
import Private from './routes/PrivateRoutes';
import AuthProvider from './context/AuthContext';
import About from './views/About';
import NotFound from './views/NotFound';

Amplify.configure({
  Auth: {
    Cognito: {
      region: import.meta.env.VITE_AMPLIFY_REGION,
      userPoolId: import.meta.env.VITE_AMPLIFY_POOL_ID,
      userPoolClientId: import.meta.env.VITE_AMPLIFY_CLIENT_ID,
    },
  },
});

export default function App() {
  const [colorTheme, setTheme] = useDarkMode();
 
  return(
    <AuthProvider>
      <AppRoutes/>
    </AuthProvider>
   
  )
}

function AppRoutes(){
  const {user: loggedInUser} = useAuthContext();
  return (
    <>
        <Routes>
          <Route path="/recipe/:id" element={<RecipeDetailPage />} />
          <Route path="/" element={<RecipeFeed />} />
          <Route path="*" element={<NotFound />} />

          <Route element={<Public />}>
            <Route path="/auth" element={<AuthPage />} />
          </Route>
        

          <Route element={<Private />}>
            <Route 
            path= "/profile"
              element={<Navigate to ={`/profile/${loggedInUser?.userId}`} replace/>}
              />
            <Route path="/profile/:id" element={<Profile />} />
            <Route path="/settings" element={<ProfileSettings />} />
            {/* <Route path="/createRecipe" element={<CreateRecipePage />} /> */}
            <Route path="/createRecipe">
              <Route index element={<CreateRecipePage />} />
              <Route path=":id" element={<CreateRecipePage />} />
            </Route>

            <Route path="/dashboard" element={<DashBoard />} />
            <Route path="/about" element={<About />} />
          </Route>
        </Routes>
    </>
  );
}
