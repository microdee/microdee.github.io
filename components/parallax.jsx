
export default class ParallaxEffect
{
    registerWithAnimFrame(refElement)
    {
        let root = document.getElementById("root");
        let absTop = (el, t) =>
            el == root || !el ? t : absTop(el.offsetParent, t + el.offsetTop);

        let animBody = timestamp => {
            if(refElement)
            {
                let coeffStr = getComputedStyle(refElement).getPropertyValue('--parallax-coeff');
                let coeff = parseFloat(coeffStr);
                let bb = refElement.getBoundingClientRect();
                let top = absTop(refElement, 0);
                let value = (root.scrollTop - top + (root.clientHeight - refElement.offsetHeight) * 0.5) * coeff;

                refElement.style.transform = `translateY(${value}px)`;
                window.requestAnimationFrame(animBody);
            }
        };
        window.requestAnimationFrame(animBody);
    }

    registerWithAnimWorklet(refElement)
    {
        let registerBody = () => {
            let root = document.getElementById("root");
            var scrollRange = root.scrollHeight - root.clientHeight;
            var from = -refElement.offsetTop * coeff;
            var to = (scrollRange - refElement.offsetTop) * coeff;
            
            return new WorkletAnimation('scrollbased',
                new KeyframeEffect(refElement, [
                    {transform: `translateY(${from}px)`},
                    {transform: `translateY(${to}px)`}
                ], scrollRange),
                new ScrollTimeline({
                    scrollSource: root,
                    orientation: 'block',
                    timeRange: scrollRange
                })
            );
        }
        
        this.animator = registerBody();
        this.animator.play();

        new ResizeObserver(e => {
            this.animator?.cancel();
            this.animator = registerBody();
            this.animator.play();
            
        }).observe(document.querySelector("#appRoot"));
    }

    register(refElement)
    {
        this.registerWithAnimFrame(refElement);
    }
}