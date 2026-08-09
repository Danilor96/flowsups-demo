import { Input } from '@/app/ui/inputs/Input';
import { BorderedContent } from '@/app/ui/modalWindowsStructure/BorderedContent';
import DecimalInput from './PercentInput';
import { CheckboxInput } from '@/app/ui/inputs/CheckboxInput';

interface PercentInputsType {
  frontGross: string;
  backGross: string;
  ofCashDown: string;
  salesPersonId: string;
  excludeReserveOrFlat: boolean;
}

interface PayPlanProps {
  isPercent: boolean;
  percentInputs: PercentInputsType;
  flatInputs: PercentInputsType;
  monthlyVehicleSalesGoal: number | null;
  onChangeMonthlyVehicleSalesGoal: (value: number | null) => void;
  onPercentInputsChange: (input: Partial<PercentInputsType>) => void;
  onFlatInputsChange: (input: Partial<PercentInputsType>) => void;
  onTypeChange: (optionValue: string) => void;
  fieldErrors: any;
}

export const PayPlan = ({
  isPercent,
  percentInputs,
  flatInputs,
  monthlyVehicleSalesGoal,
  onPercentInputsChange,
  onFlatInputsChange,
  onTypeChange,
  onChangeMonthlyVehicleSalesGoal,
  fieldErrors,
}: PayPlanProps) => {
  return (
    <BorderedContent>
      <h6 className='text-gray-500 font-semibold'>Pay Plan</h6>
      <div className="flex mt-4 gap-4 ">
        <Input
          label={'Pay Type'}
          name={'pay_type'}
          type={'select'}
          onChange={e => onTypeChange(e.target.value)}
          value={isPercent ? '1' : '2'}
          width={10}
          options={[
            { value: 1, option: 'Percent' },
            { value: 2, option: 'Flat' },
          ]}
          //   disabled={el.disabled}
          //   fieldErrors={fieldErrors}
        />
        {isPercent && (
          <div className="flex gap-4">
            <DecimalInput
              label={'Front Gross'}
              name={'front_gross'}
              onChange={e => onPercentInputsChange({ frontGross: e.target.value })}
              value={percentInputs.frontGross.toString()}
              width={7}
              placeholder="0.00"
              fieldErrors={fieldErrors}
              type="percent"
            />
            <DecimalInput
              label={'Back Gross'}
              name={'back_gross'}
              onChange={e => onPercentInputsChange({ backGross: e.target.value })}
              value={percentInputs.backGross.toString()}
              width={7}
              placeholder="0.00"
              fieldErrors={fieldErrors}
              type="percent"
            />
            <DecimalInput
              label={'% Of Cash Down'}
              name={'of_cash_down'}
              onChange={e => onPercentInputsChange({ ofCashDown: e.target.value })}
              value={percentInputs.ofCashDown.toString()}
              width={7}
              placeholder="0.00"
              fieldErrors={fieldErrors}
              type="percent"
            />
            <Input
              label={'Sales Person ID '}
              name={'sales_person_id'}
              type={'text'}
              onChange={e => onPercentInputsChange({ salesPersonId: e.target.value })}
              value={percentInputs.salesPersonId}
              width={10}
              fieldErrors={fieldErrors}
            />
            <div className="flex items-center h-[5.277778vh] self-end">
              <CheckboxInput
                name={'exclude'}
                onChange={e => onPercentInputsChange({ excludeReserveOrFlat: e.target.checked })}
                checked={percentInputs.excludeReserveOrFlat}
                chekcboxText="Exclude Reserve or Flat"
              />
            </div>
          </div>
        )}
        {!isPercent && (
          <div className="flex gap-4">
            <DecimalInput
              label={'Front Gross'}
              name={'front_gross'}
              type={'money'}
              onChange={e => onFlatInputsChange({ frontGross: e.target.value })}
              value={flatInputs.frontGross}
              width={10}
              fieldErrors={fieldErrors}
              placeholder="0.00"
            />
            <DecimalInput
              label={'Back Gross'}
              name={'back_gross'}
              type={'money'}
              onChange={e => onFlatInputsChange({ backGross: e.target.value })}
              value={flatInputs.backGross}
              width={10}
              fieldErrors={fieldErrors}
              placeholder="0.00"
            />
            <DecimalInput
              label={'Cash Down Flat'}
              name={'cash_down_flat'}
              type={'money'}
              onChange={e => onFlatInputsChange({ ofCashDown: e.target.value })}
              value={flatInputs.ofCashDown}
              width={10}
              placeholder="0.00"
              fieldErrors={fieldErrors}
            />
            <Input
              label={'Sales Person ID '}
              name={'sales_person_id'}
              type={'text'}
              onChange={e => onFlatInputsChange({ salesPersonId: e.target.value })}
              value={flatInputs.salesPersonId}
              width={10}
              fieldErrors={fieldErrors}
            />
          </div>
        )}
      </div>
      <h6 className='mt-8 mb-2 text-gray-500 font-semibold'>Goals</h6>
      <div className=''>
        <Input 
        label='Vehicles Sold (Monthly)'
        name='vehicles_sold'
        type='number'
        value={monthlyVehicleSalesGoal?.toString() || ''}
        onChange={e => onChangeMonthlyVehicleSalesGoal(Number(e.target.value || 0) || null)}
        width={8}
        fieldErrors={fieldErrors}
      />
      </div>
      
    </BorderedContent>
  );
};

export default PayPlan;
