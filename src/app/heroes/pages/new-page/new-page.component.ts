import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { filter, switchMap, tap } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';

import { Hero, Publisher } from '../../interfaces/hero.interfaces';
import { HeroesService } from '../../services/heroes.service';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-new-page',
  templateUrl: './new-page.component.html',
  styles: [
  ]
})
export class NewPageComponent implements OnInit {
  public heroForm = new FormGroup({
    id: new FormControl<string>(''),
    superhero: new FormControl<string>('',{nonNullable:true}),
    publisher: new FormControl<Publisher>(Publisher.DCComics),
    alter_ego: new FormControl(''),
    first_appearance: new FormControl(''),
    characters: new FormControl(''),
    alt_img: new FormControl('')
  });
  public publishers = [
    {id:'DC Comics',desc:'DC - Comics'},
    {id:'Marvel Comics',desc:'Marvel - Comics'}
  ];
  constructor(
    private heroesService:HeroesService,
    private activatedRoute:ActivatedRoute,
    private route:Router,
    private snackbar: MatSnackBar,
    private dialog: MatDialog
  ) {}
  get currenHero():Hero{
    const hero = this.heroForm.value as Hero;
    return hero;
  }
  ngOnInit(): void {

    if (!this.route.url.includes('edit') ) return;
    this.activatedRoute.params
      .pipe(
        switchMap( ({id}) => this.heroesService.getHeroById(id) )
      ).subscribe( hero => {
        if(!hero) return this.route.navigateByUrl('/');
        this.heroForm.reset( hero );
        return;
      })

  }
  onSubmit(){
    if(this.heroForm.invalid) return;
    if(this.currenHero.id){
      this.heroesService.updateHero(this.currenHero)
        .subscribe(hero =>{
          this.showSnackbar(`${ hero.superhero } updated!`)
        });
      return;
    }
    this.heroesService.addHero(this.currenHero)
      .subscribe( hero =>{
        this.route.navigate(['/heroes/edit',hero.id])
        this.showSnackbar(`${ hero.superhero } created!`)
      })
  }

  onDeleteHero(){
    if(!this.currenHero.id) throw Error('hero id is required');

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: this.heroForm.value
    });

    dialogRef.afterClosed()
    .pipe(
      filter((result:boolean) => result),
      switchMap( () => this.heroesService.deleteHeroById(this.currenHero.id)),
      filter((wasDeleted:boolean) => wasDeleted),
    )
    .subscribe(() => {
      this.route.navigate(['/heroes']);
    })

    // dialogRef.afterClosed().subscribe(result => {
    //   if(!result)return;
    //   this.heroesService.deleteHeroById(this.currenHero.id)
    //   .subscribe( wasDeleted => {
    //     if(wasDeleted){
    //       this.route.navigate(['/heroes']);
    //     }
    //   })
    // });
  }


  showSnackbar(message:string):void {
    this.snackbar.open(message, 'done',{
      duration: 2500,
    })
  }
}
