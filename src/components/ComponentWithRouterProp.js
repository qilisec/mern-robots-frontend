import { useLocation, useNavigate, useParams } from 'react-router-dom';

export default function withRouter(Component) {
  function ComponentWithRouterProp(props) {
    const location = useLocation();
    const navigate = useNavigate();
    const params = useParams();
    const router = { location, navigate, params };
    return <Component {...props} router={router} />;
  }

  return ComponentWithRouterProp;
}
