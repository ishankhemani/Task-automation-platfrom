import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../../../components/ui/dialog.js';
import { Button } from '../../../components/ui/button.js';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../config/constants.js';

export function SessionExpiredModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const navigate = useNavigate();

  const handleLoginRedirect = () => {
    onClose();
    navigate(ROUTES.LOGIN, { replace: true });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Session Expired</DialogTitle>
          <DialogDescription>
            Your session has ended for security reasons. Please sign in again to resume your task workflows.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={handleLoginRedirect} className="w-full">
            Log In Again
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
