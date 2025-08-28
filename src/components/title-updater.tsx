import {useEffect} from 'react';
import {useLocation} from 'react-router-dom';

export default function TitleUpdater() {
    const location = useLocation();
    const baseTitle = import.meta.env.VITE_HAYASPIN_SKIN_NAME;

    useEffect(() => {
        const pathname = location.pathname === '/' ? '' : location.pathname.substring(1);

        const formattedPathname = pathname
            .split('/')
            .map(part => part.charAt(0).toUpperCase() + part.slice(1))
            .join(' / ');

        document.title = formattedPathname
            ? `${baseTitle} | ${formattedPathname}`
            : baseTitle;

    }, [location, baseTitle]);

    return null;
}
