"use client"
import React, { useState, useEffect } from 'react';
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

const FirstVisitPopup = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const hasVisited = localStorage.getItem('hasVisitedLoca');
    if (!hasVisited) {
      setIsOpen(true);
      localStorage.setItem('hasVisitedLoca', 'true');
    }
  }, []);

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Welcome to Loca AI</AlertDialogTitle>
          <AlertDialogDescription>
            Loca is an AI-powered local services finder. Please note:
            <ul className="list-disc pl-5 mt-2">
              <li>Loca can only find services based on your specific input.</li>
              <li>General greetings like &quot;Hi&quot; are not supported.</li>
              <li>Casual chatting is not supported.</li>
              <li>Focus on asking about local services you need.</li>
            </ul>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction onClick={() => setIsOpen(false)} className='text-[#ccc]'>Got it!</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default FirstVisitPopup;