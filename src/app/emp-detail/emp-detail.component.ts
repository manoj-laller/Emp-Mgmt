import { Component, OnInit } from '@angular/core';
import { validateBasis } from '@angular/flex-layout';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Emp } from '../emp';
import { EmpService } from '../emp.service';

@Component({
  selector: 'app-emp-detail',
  templateUrl: './emp-detail.component.html',
  styleUrls: ['./emp-detail.component.css']
})
export class EmpDetailComponent implements OnInit {

  emp: Emp = new Emp();
  form : FormGroup;

  constructor(private fb: FormBuilder,
    private empService : EmpService,
    private actRoute: ActivatedRoute,
    private router: Router) {

      this.form = this.fb.group({
        id : new FormControl(''),
        name : new FormControl('', Validators.required),
        phone : new FormControl(''),
        email : new FormControl('', [Validators.required, Validators.email]),
        sex : new FormControl('M', Validators.required),
        designation : new FormControl(''),
        dob : new FormControl(null),
        active : new FormControl(true)
      });
   }

  ngOnInit(): void {
    let clone: Boolean = false;
    this.actRoute.queryParamMap.subscribe(params => {
      if(params.get("clone") != null){
        clone = true;
      }
    });

    this.actRoute.paramMap.subscribe(params => {
      const eid = parseInt(params.get('id'));

      if(eid > 0){
        this.empService.getEmployeeById(eid).subscribe((data) => {
          if(clone && data){
            data.id = null;
          }
          this.emp = data;
          this.form.patchValue(this.emp);
        });
      }
    });
  }

  onSubmit(){
    if(this.form.valid) {
      let val = this.form.value;
      this.empService.saveEmployee(val).subscribe(data => {
         this.router.routeReuseStrategy.shouldReuseRoute = () => false;
         this.exit();
      });
    }
  }

  validCheck = (control: string, validator: string) => {
    return this.form.controls[control].hasError(validator);
  }

  exit(){
    this.router.navigate(["/Employees"]);
  }
}
