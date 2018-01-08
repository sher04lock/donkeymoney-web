import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'prettyDateFormat'
})
export class PrettyDateFormat implements PipeTransform {
    transform(value: string): string {
        // 2017-12-19T13:42:33.000Z -> 2017-12-19 at 13:42:33
        return `${this.extractDate(value)} at ${this.extractTime(value)}`;
    }

    private extractDate(value: string) {
        return value.substr(0, 10);
    }

    private extractTime(value: string) {
        return value.substr(value.indexOf("T") + 1, 8);
    }
}
