declare module 'easy-scroll' {
    interface Options {
        /**
         * Window or any other scrollable DOM element
         */
        scrollableDomEle: Element;
        /**
         * The direction in which you want the element to scroll - top, left, bottom, right
         */
        direction: 'top' | 'left' | 'bottom' | 'right';
        /**
         * The duration in milliseconds over which you want the scrolling to happen
         */
        duration: number;

        easingPreset:
            | 'linear'
            | 'easeInQuad'
            | 'easeOutQuad'
            | 'easeInOutQuad'
            | 'easeInCubic'
            | 'easeOutCubic'
            | 'easeInOutCubic'
            | 'easeInQuart'
            | 'easeOutQuart'
            | 'easeInOutQuart'
            | 'easeInQuint'
            | 'easeOutQuint'
            | 'easeInOutQuint';
        /**
         * Object containing the 4 points to define a bezier curve
         * {
         *     'x1': Number(>= 0 and <= 1),
         *     'y1': Number,
         *     'x2': Number(>= 0 and <= 1),
         *     'y2': Number
         * }
         */
        cubicBezierPoints?: { x1: number; y1: number; x2: number; y2: number };
        /**
         * Callback function which is called on each tick of the scroll.
         * The current instance of the scrolling animation is passed as an argument by default.
         * You can use cancelAnimationFrame on this instance to cancel the scrolling.
         */
        onRefUpdateCallback?: any;
        /**
         * Callback function which is called after the scrolling is done
         */
        onAnimationCompleteCallback?: any;
        /**
         * The amount that needs to be scrolled in pixels.
         * If this is not specified, the element will be scrolled to the end.
         */
        scrollAmount?: number;
    }
    const easyScroll: (options: Options) => void;
    export default easyScroll;
}