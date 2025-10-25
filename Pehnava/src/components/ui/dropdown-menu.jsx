import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
} from "react";
import { motion, AnimatePresence } from "framer-motion";

const DropdownMenuContext = createContext();

const DropdownMenu = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [triggerRef, setTriggerRef] = useState(null);
  const [contentRef, setContentRef] = useState(null);

  return (
    <DropdownMenuContext.Provider
      value={{
        isOpen,
        setIsOpen,
        triggerRef,
        setTriggerRef,
        contentRef,
        setContentRef,
      }}
    >
      <div className="relative">{children}</div>
    </DropdownMenuContext.Provider>
  );
};

const DropdownMenuTrigger = React.forwardRef(
  ({ asChild, children, ...props }, ref) => {
    const { setIsOpen, setTriggerRef } = useContext(DropdownMenuContext);

    useEffect(() => {
      if (ref) {
        setTriggerRef(ref.current);
      }
    }, [ref, setTriggerRef]);

    const handleClick = () => {
      setIsOpen((prev) => !prev);
    };

    if (asChild) {
      return React.cloneElement(children, {
        ref,
        onClick: handleClick,
        ...props,
      });
    }

    return (
      <button ref={ref} onClick={handleClick} {...props}>
        {children}
      </button>
    );
  }
);

const DropdownMenuContent = React.forwardRef(
  ({ children, align = "start", className = "", ...props }, ref) => {
    const { isOpen, setIsOpen, triggerRef, setContentRef } =
      useContext(DropdownMenuContext);
    const [position, setPosition] = useState({ top: 0, left: 0 });

    useEffect(() => {
      if (ref) {
        setContentRef(ref.current);
      }
    }, [ref, setContentRef]);

    useEffect(() => {
      if (isOpen && triggerRef && ref?.current) {
        const triggerRect = triggerRef.getBoundingClientRect();
        const contentRect = ref.current.getBoundingClientRect();

        let top = triggerRect.bottom + window.scrollY + 4;
        let left = triggerRect.left + window.scrollX;

        if (align === "end") {
          left = triggerRect.right + window.scrollX - contentRect.width;
        } else if (align === "center") {
          left =
            triggerRect.left +
            window.scrollX +
            (triggerRect.width - contentRect.width) / 2;
        }

        // Adjust if content goes off screen
        if (left + contentRect.width > window.innerWidth) {
          left = window.innerWidth - contentRect.width - 16;
        }
        if (left < 0) {
          left = 16;
        }

        setPosition({ top, left });
      }
    }, [isOpen, triggerRef, align]);

    useEffect(() => {
      const handleClickOutside = (event) => {
        if (
          isOpen &&
          ref?.current &&
          !ref.current.contains(event.target) &&
          !triggerRef?.contains(event.target)
        ) {
          setIsOpen(false);
        }
      };

      if (isOpen) {
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
          document.removeEventListener("mousedown", handleClickOutside);
      }
    }, [isOpen, setIsOpen, triggerRef]);

    return (
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={ref}
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.15 }}
            className={`fixed z-50 min-w-[8rem] overflow-hidden rounded-md border bg-white shadow-md ${className}`}
            style={{
              top: position.top,
              left: position.left,
            }}
            {...props}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    );
  }
);

const DropdownMenuItem = React.forwardRef(
  ({ children, className = "", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-gray-100 focus:bg-gray-100 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

const DropdownMenuLabel = React.forwardRef(
  ({ children, className = "", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`px-2 py-1.5 text-sm font-semibold text-gray-900 ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

const DropdownMenuSeparator = React.forwardRef(
  ({ className = "", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`-mx-1 my-1 h-px bg-gray-200 ${className}`}
        {...props}
      />
    );
  }
);

DropdownMenuTrigger.displayName = "DropdownMenuTrigger";
DropdownMenuContent.displayName = "DropdownMenuContent";
DropdownMenuItem.displayName = "DropdownMenuItem";
DropdownMenuLabel.displayName = "DropdownMenuLabel";
DropdownMenuSeparator.displayName = "DropdownMenuSeparator";

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
};
