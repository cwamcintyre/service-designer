import { Handle, Position } from '@xyflow/react';
import { LabeledHandle } from "@/components/labeled-handle";
const handleStyle = { left: 10 };

export default function PageNode({ data }: any) { 
    return (
        <>
            <Handle type="target" position={Position.Top} />      
            <div className="w-full text-center px-11 py-3 text-xs">
                {data.label}  
            </div>
            <div className='flex text-xs'>
                <LabeledHandle
                    type="source"
                    position={Position.Bottom}
                    title=""
                    className="pb-2 grow"
                    id="default-handle"                                       
                />
                {data.conditions && data.conditions.map((condition: any, index: number) => (
                    <div className="flex justify-between px-4" key={index}>
                        <LabeledHandle
                            type="source"
                            position={Position.Bottom}
                            title={condition.label}
                            className="pb-2 grow"
                            id={`condition-${condition.id}`}                                       
                        />
                    </div>
                ))}
            </div>
        </>
    );
}