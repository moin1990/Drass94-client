import { useEffect } from 'react';

const useTitle = (title) => {
  useEffect(() => {
    document.title = title ? `${title} | IdeaVault` : 'IdeaVault – Startup Idea Sharing Platform';
  }, [title]);
};

export default useTitle;
