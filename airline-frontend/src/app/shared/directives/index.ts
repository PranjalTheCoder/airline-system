import {
  Directive, Output, EventEmitter, HostListener,
  ElementRef, Input, OnInit, OnDestroy
} from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

// ─── Debounce Input Directive ─────────────────────────────────
// Usage: <input appDebounce [debounceTime]="400" (debouncedInput)="onSearch($event)" />
@Directive({
  selector:   '[appDebounce]',
  standalone: true,
})
export class DebounceDirective implements OnInit, OnDestroy {
  @Input()  debounceTime = 400;
  @Output() debouncedInput = new EventEmitter<string>();

  private subject = new Subject<string>();
  private sub!: Subscription;

  ngOnInit() {
    this.sub = this.subject.pipe(
      debounceTime(this.debounceTime),
      distinctUntilChanged()
    ).subscribe(val => this.debouncedInput.emit(val));
  }

  @HostListener('input', ['$event.target.value'])
  onInput(value: string) { this.subject.next(value); }

  ngOnDestroy() { this.sub?.unsubscribe(); }
}

// ─── Click Outside Directive ──────────────────────────────────
// Usage: <div appClickOutside (clickedOutside)="close()">...</div>
@Directive({
  selector:   '[appClickOutside]',
  standalone: true,
})
export class ClickOutsideDirective {
  @Output() clickedOutside = new EventEmitter<void>();

  constructor(private el: ElementRef) {}

  @HostListener('document:click', ['$event.target'])
  onClick(target: HTMLElement) {
    if (!this.el.nativeElement.contains(target)) {
      this.clickedOutside.emit();
    }
  }
}

// ─── Auto Focus Directive ─────────────────────────────────────
// Usage: <input appAutoFocus />
@Directive({
  selector:   '[appAutoFocus]',
  standalone: true,
})
export class AutoFocusDirective implements OnInit {
  constructor(private el: ElementRef) {}
  ngOnInit() {
    setTimeout(() => this.el.nativeElement.focus(), 100);
  }
}

// ─── Uppercase Input Directive ────────────────────────────────
// Usage: <input appUppercase />  — forces value to uppercase as user types
@Directive({
  selector:   '[appUppercase]',
  standalone: true,
})
export class UppercaseDirective {
  constructor(private el: ElementRef) {}

  @HostListener('input')
  onInput() {
    const input = this.el.nativeElement as HTMLInputElement;
    const pos   = input.selectionStart;
    input.value = input.value.toUpperCase();
    input.setSelectionRange(pos, pos);
  }
}

// ─── Scroll Into View Directive ───────────────────────────────
// Usage: <div appScrollIntoView [scrollWhen]="hasError">
@Directive({
  selector:   '[appScrollIntoView]',
  standalone: true,
})
export class ScrollIntoViewDirective implements OnInit {
  @Input() scrollWhen = false;

  constructor(private el: ElementRef) {}

  ngOnInit() {
    if (this.scrollWhen) {
      setTimeout(() => {
        this.el.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    }
  }
}
