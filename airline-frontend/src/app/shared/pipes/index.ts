import { Pipe, PipeTransform } from '@angular/core';

// ─── Duration Pipe ────────────────────────────────────────────
// Usage: {{ 435 | duration }}  → "7h 15m"
@Pipe({ name: 'duration', standalone: true })
export class DurationPipe implements PipeTransform {
  transform(minutes: number): string {
    if (!minutes || isNaN(minutes)) return '—';
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return h > 0 ? `${h}h ${m > 0 ? m + 'm' : ''}`.trim() : `${m}m`;
  }
}

// ─── Cabin Label Pipe ─────────────────────────────────────────
// Usage: {{ 'PREMIUM_ECONOMY' | cabinLabel }}  → "Prem. Economy"
@Pipe({ name: 'cabinLabel', standalone: true })
export class CabinLabelPipe implements PipeTransform {
  private map: Record<string, string> = {
    ECONOMY:         'Economy',
    PREMIUM_ECONOMY: 'Prem. Economy',
    BUSINESS:        'Business',
    FIRST:           'First Class',
  };
  transform(type: string): string {
    return this.map[type] ?? type;
  }
}

// ─── Relative Time Pipe ───────────────────────────────────────
// Usage: {{ booking.createdAt | relativeTime }}  → "2 days ago"
@Pipe({ name: 'relativeTime', standalone: true })
export class RelativeTimePipe implements PipeTransform {
  transform(value: string | Date): string {
    if (!value) return '';
    const now  = new Date();
    const date = new Date(value);
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diff < 60)     return 'just now';
    if (diff < 3600)   return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400)  return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  }
}

// ─── Fare Format Pipe ─────────────────────────────────────────
// Usage: {{ 1299.9 | fare:'USD' }}  → "USD 1,300"
@Pipe({ name: 'fare', standalone: true })
export class FarePipe implements PipeTransform {
  transform(amount: number, currency = 'USD'): string {
    if (amount === undefined || amount === null) return '—';
    return `${currency} ${Math.round(amount).toLocaleString('en-US')}`;
  }
}

// ─── Status Color Pipe ────────────────────────────────────────
// Usage: {{ flight.status | statusColor }}  → CSS class name
@Pipe({ name: 'statusColor', standalone: true })
export class StatusColorPipe implements PipeTransform {
  private map: Record<string, string> = {
    SCHEDULED: 'badge-blue',
    ON_TIME:   'badge-green',
    DELAYED:   'badge-amber',
    CANCELLED: 'badge-red',
    DEPARTED:  'badge-neutral',
    ARRIVED:   'badge-green',
    CONFIRMED: 'badge-green',
    TICKETED:  'badge-blue',
    PENDING:   'badge-amber',
    HOLD:      'badge-amber',
    REFUNDED:  'badge-neutral',
  };
  transform(status: string): string {
    return 'badge ' + (this.map[status] ?? 'badge-neutral');
  }
}

// ─── Airport Display Pipe ─────────────────────────────────────
// Usage: {{ airport | airportDisplay }}  → "New York (JFK)"
@Pipe({ name: 'airportDisplay', standalone: true })
export class AirportDisplayPipe implements PipeTransform {
  transform(airport: { city: string; code: string } | null): string {
    if (!airport) return '';
    return `${airport.city} (${airport.code})`;
  }
}

// ─── Seat Type Label Pipe ─────────────────────────────────────
@Pipe({ name: 'seatTypeLabel', standalone: true })
export class SeatTypeLabelPipe implements PipeTransform {
  private map: Record<string, string> = {
    STANDARD:      'Standard',
    WINDOW:        'Window',
    AISLE:         'Aisle',
    EXTRA_LEGROOM: 'Extra Legroom',
    PREMIUM:       'Premium',
  };
  transform(type: string): string { return this.map[type] ?? type; }
}

// ─── Initials Pipe ────────────────────────────────────────────
// Usage: {{ passenger | initials }}  → "JD"
@Pipe({ name: 'initials', standalone: true })
export class InitialsPipe implements PipeTransform {
  transform(value: { firstName?: string; lastName?: string } | string | null): string {
    if (!value) return '';
    if (typeof value === 'string') {
      return value.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
    }
    const f = value.firstName?.[0] ?? '';
    const l = value.lastName?.[0]  ?? '';
    return (f + l).toUpperCase();
  }
}
