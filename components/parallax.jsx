
export default class ParallaxEffect
{
    constructor()
    {
        this.prevTimestamp = 0.0;
        this.antiHisteresys = 4000.0;
        this.perfCounter = 0.0;
        this.frameMs = 0.0;
        this.lowPerfMode = false;
        this.transitionMs = 1000.0;
        this.transitionPeriod = 0.0;
    }

    determinePerfMode(timestamp)
    {
        let prevPerfCounter = this.perfCounter;
        if(this.prevTimestamp == 0) {
            this.prevTimestamp = timestamp;
        }
        this.frameMs = timestamp - this.prevTimestamp;
        this.perfCounter += this.frameMs > 33.33 ? -this.frameMs : this.frameMs * 0.1;
        if(Math.abs(this.perfCounter) >= this.antiHisteresys)
        {
            this.lowPerfMode = this.perfCounter < 0;
        }


        this.prevTimestamp = timestamp;
    }

    registerWithAnimFrame(refElement)
    {
        let root = document.getElementById("root");
        let absTop = (el, t) =>
            el == root || !el ? t : absTop(el.offsetParent, t + el.offsetTop);

        let animBody = (timestamp => {
            if(refElement) {
                this.determinePerfMode(timestamp);
                if(this.lowPerfMode) {
                    refElement.style.transition = `transform ${this.transitionMs}ms ease-in-out`;
                    refElement.style.transform = "translateY(0px)";
                    this.transitionPeriod = this.transitionMs;
                }
                else {
                    if(this.transitionPeriod < 0)
                    {
                        refElement.style.transition = "none";
                    }
                    this.transitionPeriod -= this.frameMs;
                    let coeffStr = getComputedStyle(refElement).getPropertyValue('--parallax-coeff');
                    let coeff = parseFloat(coeffStr);
                    let bb = refElement.getBoundingClientRect();
                    let top = absTop(refElement, 0);
                    let value = (root.scrollTop - top + (root.clientHeight - refElement.offsetHeight) * 0.5) * coeff;

                    refElement.style.transform = `translateY(${value}px)`;
                }
                window.requestAnimationFrame(animBody);
            }
        }).bind(this);
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