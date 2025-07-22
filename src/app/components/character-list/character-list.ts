import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { catchError, finalize } from 'rxjs';
import { Api } from '../../services/api';
import { Character } from '../../models/character';

@Component({
  selector: 'app-character-list',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule   
  ],
  templateUrl: './character-list.html',
  styleUrls: ['./character-list.scss']
})
export class CharacterListComponent implements OnInit {

  private api = inject(Api);

  public characters = this.api.characters;

  public searchTerm: string = '';
  public loading: boolean = false;
  public errorMessage: string = '';

  public hasCharacters = computed(() => this.characters().length > 0);

  ngOnInit(): void {
    this.loadInitialCharacters();
  }

  loadInitialCharacters(): void {
    this.loading = true;
    this.errorMessage = '';
    
    this.api.getCharacters()
      .pipe(
        catchError(error => {
          this.errorMessage = 'Error loading characters. Please try again.';
          throw error;
        }),
        finalize(() => this.loading = false)
      )
      .subscribe();
  }

  onSearch(): void {
    this.loading = true;
    this.errorMessage = '';
    
    this.api.searchCharacters(this.searchTerm)
      .pipe(
        catchError(error => {
          this.errorMessage = 'Error searching characters. Please try again.';
          throw error;
        }),
        finalize(() => this.loading = false)
      )
      .subscribe();
  }

  onSearchKeyup(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.onSearch();
    }
  }
}