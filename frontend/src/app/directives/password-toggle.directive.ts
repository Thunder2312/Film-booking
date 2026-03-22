import { Directive, ElementRef, Renderer2, AfterViewInit } from '@angular/core';

@Directive({
  selector: '[appPasswordToggle]'
})
export class PasswordToggleDirective implements AfterViewInit {
  private _show = false;
  private button!: HTMLElement;
  private icon!: HTMLElement;
  

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngAfterViewInit() {
    const parent = this.renderer.parentNode(this.el.nativeElement);

    // Ensure parent has relative positioning
    this.renderer.setStyle(parent, 'position', 'relative');

    // Create toggle button
    this.button = this.renderer.createElement('button');
    this.renderer.setAttribute(this.button, 'type', 'button');
    this.renderer.setAttribute(this.button, 'aria-label', 'Toggle password visibility');
    this.renderer.addClass(this.button, 'eye-button');

    // Create icon
    this.icon = this.renderer.createElement('i');
    this.renderer.addClass(this.icon, 'fa');
    this.renderer.addClass(this.icon, 'fa-eye');

    this.renderer.appendChild(this.button, this.icon);
    this.renderer.appendChild(parent, this.button);

    // Listen for click
    this.renderer.listen(this.button, 'click', () => this.toggle());
  }

  private toggle() {
    this._show = !this._show;

    // Change input type
    this.renderer.setAttribute(this.el.nativeElement, 'type', this._show ? 'text' : 'password');

    // Toggle icon class
    if (this._show) {
      this.renderer.removeClass(this.icon, 'fa-eye');
      this.renderer.addClass(this.icon, 'fa-eye-slash');
    } else {
      this.renderer.removeClass(this.icon, 'fa-eye-slash');
      this.renderer.addClass(this.icon, 'fa-eye');
    }
  }
}
